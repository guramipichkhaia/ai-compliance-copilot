/**
 * Policy configuration for escalation triggers.
 * Stored in localStorage; used by the main case page and editable on the Policy Configuration page.
 *
 * Central trigger data structure:
 * - Each trigger is uniquely identified by `id` (predefined IDs are fixed; custom use `custom_<timestamp>`).
 * - Cards and escalation logic reference triggers by this ID so they can resolve thresholds and critical
 *   toggles dynamically at runtime.
 * - The trigger configuration object (PolicyConfig) holds: triggers[] and minRegularTriggersToEscalate.
 */

export type TriggerThresholdUnit =
  | "percentage"
  | "amount"
  | "hours"
  | "count"
  | "multiplier"
  | "percentile"
  | "boolean";

/** Comparison operator for numeric thresholds. For boolean/categorical, evaluation uses equality/match. */
export type ComparisonOperator = ">" | ">=" | "<" | "<=" | "=";

export type TriggerConfig = {
  id: string;
  label: string;
  type: "predefined" | "custom";
  /** Threshold value (e.g. 100 for %, 24 for hours). For boolean triggers, 1 = required true, 0 = required false. */
  thresholdValue: number;
  thresholdUnit: TriggerThresholdUnit;
  /** Numeric comparison: observed [operator] threshold. For boolean/categorical, use "=" (equals/match). */
  comparisonOperator: ComparisonOperator;
  /** When set, trigger is "immediate escalation" when met (e.g. rapid movement <= this many hours). */
  criticalThresholdValue: number | null;
  /** If true, when this trigger is met it forces escalation regardless of count. */
  isCritical: boolean;
  /** Custom triggers are stored but not evaluated on the case page (no data source). */
  enabled: boolean;
};

export type PolicyConfig = {
  triggers: TriggerConfig[];
  /** Minimum number of regular (non-critical) triggers that must be met to escalate. */
  minRegularTriggersToEscalate: number;
};

const STORAGE_KEY = "aml-policy-config";

const PREDEFINED_IDS = [
  "baseline_deviation",
  "first_time_beneficiary",
  "elevated_risk_jurisdiction",
  "rapid_movement",
  "documentation_gap",
  "corridor_novelty",
  "prior_sar_alert_history",
  "risk_rating_elevated",
  "velocity_spike",
  "industry_outlier",
  "concentration_risk",
  "negative_media_risk",
  "sanctions_match",
] as const;

export type PredefinedTriggerId = (typeof PREDEFINED_IDS)[number];

export function getDefaultPolicyConfig(): PolicyConfig {
  return {
    minRegularTriggersToEscalate: 3,
    triggers: [
      { id: "baseline_deviation", label: "Baseline deviation", type: "predefined", thresholdValue: 100, thresholdUnit: "percentage", comparisonOperator: ">", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "first_time_beneficiary", label: "First-time beneficiary", type: "predefined", thresholdValue: 1, thresholdUnit: "boolean", comparisonOperator: "=", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "elevated_risk_jurisdiction", label: "Elevated-risk jurisdiction", type: "predefined", thresholdValue: 1, thresholdUnit: "boolean", comparisonOperator: "=", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "rapid_movement", label: "Rapid movement (hours)", type: "predefined", thresholdValue: 72, thresholdUnit: "hours", comparisonOperator: "<=", criticalThresholdValue: 24, isCritical: true, enabled: true },
      { id: "documentation_gap", label: "Documentation gap", type: "predefined", thresholdValue: 1, thresholdUnit: "boolean", comparisonOperator: "=", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "corridor_novelty", label: "Corridor novelty", type: "predefined", thresholdValue: 1, thresholdUnit: "boolean", comparisonOperator: "=", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "prior_sar_alert_history", label: "Prior SAR/Alert History", type: "predefined", thresholdValue: 0, thresholdUnit: "count", comparisonOperator: ">", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "risk_rating_elevated", label: "Risk Rating Elevated", type: "predefined", thresholdValue: 1, thresholdUnit: "boolean", comparisonOperator: "=", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "velocity_spike", label: "Velocity Spike (7d multiple)", type: "predefined", thresholdValue: 3, thresholdUnit: "multiplier", comparisonOperator: ">", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "industry_outlier", label: "Industry Outlier (percentile)", type: "predefined", thresholdValue: 90, thresholdUnit: "percentile", comparisonOperator: ">=", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "concentration_risk", label: "Concentration Risk (%)", type: "predefined", thresholdValue: 50, thresholdUnit: "percentage", comparisonOperator: ">", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "negative_media_risk", label: "Negative Media Risk", type: "predefined", thresholdValue: 1, thresholdUnit: "boolean", comparisonOperator: "=", criticalThresholdValue: null, isCritical: false, enabled: true },
      { id: "sanctions_match", label: "Sanctions match", type: "predefined", thresholdValue: 1, thresholdUnit: "boolean", comparisonOperator: "=", criticalThresholdValue: null, isCritical: true, enabled: true },
    ],
  };
}

export function getPolicyConfig(): PolicyConfig {
  if (typeof window === "undefined") return getDefaultPolicyConfig();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultPolicyConfig();
    const parsed = JSON.parse(raw) as PolicyConfig;
    const defaults = getDefaultPolicyConfig();
    const merged: PolicyConfig = {
      minRegularTriggersToEscalate: typeof parsed.minRegularTriggersToEscalate === "number" ? parsed.minRegularTriggersToEscalate : defaults.minRegularTriggersToEscalate,
      triggers: Array.isArray(parsed.triggers)
        ? parsed.triggers.map((t) => ({
            ...t,
            comparisonOperator: t.comparisonOperator ?? defaults.triggers.find((d) => d.id === t.id)?.comparisonOperator ?? "=",
          }))
        : defaults.triggers,
    };
    if (merged.triggers.length < defaults.triggers.length) {
      const defaultIds = new Set(defaults.triggers.map((t) => t.id));
      const existingIds = new Set(merged.triggers.map((t) => t.id));
      for (const t of defaults.triggers) {
        if (!existingIds.has(t.id)) merged.triggers.push(t);
      }
    }
    return merged;
  } catch {
    return getDefaultPolicyConfig();
  }
}

export function savePolicyConfig(config: PolicyConfig): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function getPredefinedTriggerIds(): readonly string[] {
  return PREDEFINED_IDS;
}
