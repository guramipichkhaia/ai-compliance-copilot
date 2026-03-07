/**
 * Centralized Case Field Registry — single source of truth for alert detail cards and policy trigger field picker.
 * Cards and fields mirror the alert detail UI exactly. No duplication between UI and config.
 */

export type FieldType = "number" | "currency" | "percentage" | "boolean" | "enum" | "hours" | "text";

export type CaseFieldDef = {
  key: string;
  label: string;
  type: FieldType;
  unit?: string;
  options?: string[];
};

export type CardDef = {
  cardId: string;
  cardTitle: string;
  fields: CaseFieldDef[];
};

/** Card-based registry: same schema used to render alert detail cards and policy field picker. */
export const caseFieldRegistry: Record<string, { title: string; fields: CaseFieldDef[] }> = {
  shortTermVelocity: {
    title: "Short-Term Velocity Analysis",
    fields: [
      { key: "totalOutbound7d", label: "Total outbound in last 7 days", type: "currency" },
      { key: "historicalOutbound7d", label: "Historical 7-day average outbound", type: "currency" },
      { key: "spikeMultiple7d", label: "Spike multiple (7d)", type: "number", unit: "x" },
    ],
  },
  sourceOfFunds: {
    title: "Source of Funds & Movement Timing",
    fields: [
      { key: "largestInbound7d", label: "Largest inbound within 7 days prior to wire", type: "currency" },
      { key: "dateOfInbound", label: "Date of inbound", type: "text" },
      { key: "dateOfOutbound", label: "Date of outbound", type: "text" },
      { key: "rapidMovementHours", label: "Rapid movement (hours)", type: "hours", unit: "h" },
    ],
  },
  corridorBeneficiary: {
    title: "Corridor & Beneficiary Risk",
    fields: [
      { key: "firstTimeCountry", label: "First time country", type: "boolean" },
      { key: "firstTimeBeneficiary", label: "First-time beneficiary", type: "boolean" },
      { key: "destinationJurisdictionRiskTier", label: "Destination Jurisdiction Risk Tier", type: "enum", options: ["Low", "Medium", "Elevated (FATF monitored)", "High"] },
    ],
  },
  exposureAggregation: {
    title: "Exposure Aggregation Summary",
    fields: [
      { key: "total90dExposureBeneficiary", label: "Total 90-day exposure to this beneficiary", type: "currency" },
      { key: "total90dExposureCountry", label: "Total 90-day exposure to this country", type: "currency" },
      { key: "pctOutboundVolumeJurisdiction90d", label: "% outbound volume to this jurisdiction (90d)", type: "percentage", unit: "%" },
    ],
  },
  statedPurpose: {
    title: "Stated Purpose & Documentation Review",
    fields: [
      { key: "documentationGap", label: "Documentation gap", type: "boolean" },
      { key: "documentationGapPresent", label: "Documentation gap present", type: "boolean" },
      { key: "priorDocumentedTradeWiresCount", label: "Prior documented trade wires (count)", type: "number" },
      { key: "priorTradeWiresTotal", label: "Prior trade wires total", type: "number" },
      { key: "averageDocumentedTradeWireAmount", label: "Average documented trade wire amount", type: "currency" },
      { key: "paymentReferenceText", label: "Payment reference text", type: "text" },
    ],
  },
  customerRiskDrift: {
    title: "Customer Risk Drift & Alert History",
    fields: [
      { key: "riskRatingOnboarding", label: "Risk rating at onboarding", type: "enum", options: ["Low", "Medium", "High"] },
      { key: "currentInternalRiskRating", label: "Current internal risk rating", type: "enum", options: ["Low", "Medium", "High"] },
      { key: "alertsLast90Days", label: "Number of alerts in last 90 days", type: "number" },
      { key: "priorSarFilings", label: "Prior SAR filings", type: "boolean" },
      { key: "priorSarCount", label: "Prior SAR count", type: "number" },
      { key: "riskRatingElevated", label: "Risk rating elevated", type: "boolean" },
    ],
  },
  adverseMedia: {
    title: "Adverse Media / Reputation",
    fields: [
      { key: "negativeMediaRisk", label: "Negative Media Risk", type: "boolean" },
      { key: "adverseMediaIndicator", label: "Adverse media indicator", type: "boolean" },
    ],
  },
};

/** Ordered card IDs for consistent display (alert cards + field picker). */
export const CARD_ORDER: string[] = [
  "shortTermVelocity",
  "sourceOfFunds",
  "corridorBeneficiary",
  "exposureAggregation",
  "statedPurpose",
  "customerRiskDrift",
  "adverseMedia",
];

/** Flattened list of all fields for lookup by key. */
const _flatFields = new Map<string, CaseFieldDef>();
for (const card of Object.values(caseFieldRegistry)) {
  for (const f of card.fields) {
    _flatFields.set(f.key, f);
  }
}

export function getFieldByKey(key: string): CaseFieldDef | undefined {
  return _flatFields.get(key);
}

/** Cards as array for iteration (e.g. alert detail sections, field picker groups). */
export function getCards(): CardDef[] {
  return CARD_ORDER.map((cardId) => {
    const card = caseFieldRegistry[cardId];
    return { cardId, cardTitle: card?.title ?? cardId, fields: card?.fields ?? [] };
  }).filter((c) => c.fields.length > 0);
}

/** All fields in registry order (for legacy getOperatorsForField, etc.). */
export function getAllFields(): CaseFieldDef[] {
  const out: CaseFieldDef[] = [];
  for (const card of getCards()) {
    out.push(...card.fields);
  }
  return out;
}

/** Operators by field type (number-like: number, currency, percentage, hours). */
export const NUMBER_OPERATORS = [
  { value: ">", label: ">" },
  { value: ">=", label: "≥" },
  { value: "<", label: "<" },
  { value: "<=", label: "≤" },
  { value: "=", label: "=" },
] as const;

export const BOOLEAN_OPERATORS = [
  { value: "boolean_true", label: "is true" },
] as const;

export const ENUM_OPERATORS = [
  { value: "gte", label: "≥ (at or above)" },
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "not equals" },
] as const;

export function getOperatorsForField(fieldKey: string): { value: string; label: string }[] {
  const field = getFieldByKey(fieldKey);
  if (!field) return [...NUMBER_OPERATORS];
  switch (field.type) {
    case "boolean":
      return [...BOOLEAN_OPERATORS];
    case "enum":
      return [...ENUM_OPERATORS];
    case "number":
    case "currency":
    case "percentage":
    case "hours":
      return [...NUMBER_OPERATORS];
    case "text":
      return [...ENUM_OPERATORS];
    default:
      return [...NUMBER_OPERATORS];
  }
}

/** Group by card for dropdown (card title → fields). */
export function getRegistryByCategory(): Map<string, CaseFieldDef[]> {
  const map = new Map<string, CaseFieldDef[]>();
  for (const card of getCards()) {
    map.set(card.cardTitle, card.fields);
  }
  return map;
}

/** Filter cards/fields by search query (label or key). */
export function searchFields(query: string): { cardTitle: string; field: CaseFieldDef }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: { cardTitle: string; field: CaseFieldDef }[] = [];
  for (const card of getCards()) {
    for (const field of card.fields) {
      if (field.label.toLowerCase().includes(q) || field.key.toLowerCase().includes(q)) {
        results.push({ cardTitle: card.cardTitle, field });
      }
    }
  }
  return results;
}
