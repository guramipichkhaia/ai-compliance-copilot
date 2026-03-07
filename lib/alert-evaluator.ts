/**
 * Pure function: evaluate an uploaded AML alert against a policy config.
 * Produces trigger results, met counts, and escalation recommendation.
 */

import { getFieldByKey } from "./case-field-registry";
import type { PolicyConfig, UnifiedTriggerConfig } from "./policy-config";
import { evaluateTrigger } from "./rule-evaluator";
import type { UploadedAlert } from "./aml-alert-upload-schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TriggerResult = {
  triggerId: string;
  triggerName: string;
  observed_value: string | number;
  threshold_value: string | number;
  result: "Met" | "Not Met";
  severity: "Critical" | "Regular";
};

export type EvaluatedAlert = {
  triggers: TriggerResult[];
  triggers_met_count: number;
  escalation_recommended: boolean;
  evaluation_timestamp: string; // ISO
  policy_version: string;
};

/** Map UploadedAlert to caseData keys expected by triggers and alert detail cards (registry field keys). Exported for UI to show imported alert data. */
export function getCaseDataFromUploadedAlert(alert: UploadedAlert): Record<string, unknown> {
  const riskOrder: Record<string, number> = { Low: 0, Medium: 1, High: 2 };
  const onboardingRank = riskOrder[alert.risk_rating_onboarding] ?? 0;
  const currentRank = riskOrder[alert.risk_rating_current] ?? 0;
  const riskRatingElevated = currentRank > onboardingRank;

  // Jurisdiction: CSV uses "Moderate" | "Elevated" | "Low" | "High"; registry uses "Medium" and "Elevated (FATF monitored)"
  let destinationJurisdictionRiskTier: string = alert.jurisdiction_risk_tier;
  if (alert.jurisdiction_risk_tier === "Moderate") destinationJurisdictionRiskTier = "Medium";
  if (alert.jurisdiction_risk_tier === "Elevated") destinationJurisdictionRiskTier = "Elevated (FATF monitored)";

  const outbound7dHistoricalAvg = alert.outbound_7d_historical_avg;
  const velocity7dMultiple =
    typeof outbound7dHistoricalAvg === "number" && outbound7dHistoricalAvg > 0
      ? alert.outbound_7d_total / outbound7dHistoricalAvg
      : null;

  const outbound90dAvg = alert.outbound_90d_avg;
  const baselineDeviationMultiple =
    typeof outbound90dAvg === "number" && outbound90dAvg > 0
      ? alert.transaction_amount / outbound90dAvg
      : null;

  const rapidMovementHours =
    typeof alert.time_gap_hours === "number" && !Number.isNaN(alert.time_gap_hours)
      ? alert.time_gap_hours
      : null;
  const concentrationPercent =
    typeof alert.pct_outbound_volume_jurisdiction_90d === "number" && !Number.isNaN(alert.pct_outbound_volume_jurisdiction_90d)
      ? alert.pct_outbound_volume_jurisdiction_90d
      : null;

  const out: Record<string, unknown> = {
    firstTimeBeneficiary: alert.first_time_beneficiary,
    firstTimeCountry: alert.first_time_country,
    destinationJurisdictionRiskTier,
    rapidMovementHours,
    velocity7dMultiple,
    baselineDeviationMultiple,
    concentrationPercent,
    riskRatingElevated,
    documentationGap: alert.documentation_gap,
    negativeMediaRisk: alert.adverse_media_flag,
    documentationGapPresent: alert.documentation_gap,
    adverseMediaIndicator: alert.adverse_media_flag,
    riskRatingOnboarding: alert.risk_rating_onboarding,
    currentInternalRiskRating: alert.risk_rating_current,
    alertsLast90Days: alert.alerts_last_90d,
    priorSarCount: alert.prior_sar_count,
  };

  if (typeof alert.total_90d_exposure_beneficiary === "number" && !Number.isNaN(alert.total_90d_exposure_beneficiary)) {
    out.total90dExposureBeneficiary = alert.total_90d_exposure_beneficiary;
  }
  if (typeof alert.total_90d_exposure_country === "number" && !Number.isNaN(alert.total_90d_exposure_country)) {
    out.total90dExposureCountry = alert.total_90d_exposure_country;
  }
  if (typeof alert.prior_documented_trade_wires_count === "number" && !Number.isNaN(alert.prior_documented_trade_wires_count)) {
    out.priorDocumentedTradeWiresCount = alert.prior_documented_trade_wires_count;
  }
  if (typeof alert.prior_trade_wires_total === "number" && !Number.isNaN(alert.prior_trade_wires_total)) {
    out.priorTradeWiresTotal = alert.prior_trade_wires_total;
  }
  if (typeof alert.average_documented_trade_wire_amount === "number" && !Number.isNaN(alert.average_documented_trade_wire_amount)) {
    out.averageDocumentedTradeWireAmount = alert.average_documented_trade_wire_amount;
  }
  if (alert.payment_reference_text != null && alert.payment_reference_text !== "") {
    out.paymentReferenceText = alert.payment_reference_text;
  }
  if (typeof alert.prior_sar_filings === "boolean") {
    out.priorSarFilings = alert.prior_sar_filings;
  }
  if (alert.date_of_inbound != null && alert.date_of_inbound !== "") {
    out.dateOfInbound = alert.date_of_inbound;
  }
  if (alert.date_of_outbound != null && alert.date_of_outbound !== "") {
    out.dateOfOutbound = alert.date_of_outbound;
  }
  if (typeof alert.outbound_7d_total === "number") out.totalOutbound7d = alert.outbound_7d_total;
  if (typeof alert.outbound_7d_historical_avg === "number") out.historicalOutbound7d = alert.outbound_7d_historical_avg;
  if (velocity7dMultiple != null) out.spikeMultiple7d = velocity7dMultiple;
  if (typeof alert.inbound_amount_7d === "number") out.largestInbound7d = alert.inbound_amount_7d;

  return out;
}

function formatThresholdForResult(
  operator: string,
  threshold: number | string | boolean,
  fieldKey: string
): string {
  const field = getFieldByKey(fieldKey);
  if (field?.type === "boolean") return "is true";
  if (field?.type === "enum") return operator === "gte" ? `≥ ${String(threshold)}` : `${operator} ${String(threshold)}`;
  const sym = operator === ">=" ? "≥" : operator === "<=" ? "≤" : operator;
  const suffix =
    field?.unit === "%" || field?.type === "percentage"
      ? "%"
      : field?.unit === "h" || field?.type === "hours"
        ? "h"
        : field?.unit ?? "";
  return `${sym} ${threshold}${suffix}`;
}

/**
 * Evaluate an uploaded alert using only the triggers defined in the policy configuration.
 * No ad-hoc or fixed trigger list: policyConfig.triggers is the single source of truth.
 */
export function evaluateAlert(
  alert: UploadedAlert,
  policyConfig: PolicyConfig
): EvaluatedAlert {
  const caseData = getCaseDataFromUploadedAlert(alert);
  const evaluation_timestamp = new Date().toISOString();
  const policy_version =
    (policyConfig as PolicyConfig & { policyVersion?: string }).policyVersion ?? "1.0";

  const triggers: TriggerResult[] = [];

  for (const tc of policyConfig.triggers) {
    const triggerId = tc.id;
    const name = tc.name;
    const critical = tc.critical ?? false;
    const severity: "Critical" | "Regular" = critical ? "Critical" : "Regular";

    let result: TriggerResult;
    if (!tc.enabled) {
      result = {
        triggerId,
        triggerName: `${name} (disabled)`,
        observed_value: "—",
        threshold_value: "—",
        result: "Not Met",
        severity,
      };
    } else {
      const evalResult = evaluateTrigger(
        { fieldKey: tc.fieldKey, operator: tc.operator, threshold: tc.threshold },
        caseData
      );
      const threshold_value = formatThresholdForResult(
        tc.operator,
        tc.threshold,
        tc.fieldKey
      );

      result = {
        triggerId,
        triggerName: name,
        observed_value: evalResult.observedValue,
        threshold_value,
        result: evalResult.resultLabel,
        severity,
      };
    }
    triggers.push(result);
  }

  const triggers_met_count = triggers.filter((t) => t.result === "Met").length;

  const criticalMet = triggers.filter(
    (t) => t.severity === "Critical" && t.result === "Met"
  ).length;
  const regularMet = triggers.filter(
    (t) => t.severity === "Regular" && t.result === "Met"
  ).length;
  const minRegular = policyConfig.minRegularTriggersToEscalate ?? 4;
  const escalation_recommended =
    criticalMet >= 1 || regularMet >= minRegular;

  return {
    triggers,
    triggers_met_count,
    escalation_recommended,
    evaluation_timestamp,
    policy_version,
  };
}
