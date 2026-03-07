/**
 * Strict CSV ingestion schema for AML alert uploads.
 * Defines the required columns and types expected for each alert row.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// TypeScript interface (source of truth for alert-level shape)
// ---------------------------------------------------------------------------

export const TRANSACTION_TYPES = [
  "Wire",
  "ACH",
  "Cash Deposit",
  "Crypto Transfer",
] as const;

export const RISK_RATINGS = ["Low", "Medium", "High"] as const;

export const JURISDICTION_RISK_TIERS = [
  "Low",
  "Moderate",
  "Elevated",
  "High",
] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export type RiskRating = (typeof RISK_RATINGS)[number];
export type JurisdictionRiskTier = (typeof JURISDICTION_RISK_TIERS)[number];

/** Alert-level record as expected after CSV parsing (strict types). */
export interface UploadedAlert {
  alert_id: string;
  customer_id: string;
  customer_name: string;
  transaction_type: TransactionType;
  transaction_date: string; // ISO date (YYYY-MM-DD)
  transaction_amount: number;
  transaction_country: string;
  beneficiary_name: string;
  beneficiary_country: string;
  inbound_amount_7d: number;
  outbound_7d_total: number;
  outbound_7d_historical_avg: number;
  outbound_90d_avg: number;
  prior_6m_max_transaction: number;
  risk_rating_onboarding: RiskRating;
  risk_rating_current: RiskRating;
  prior_sar_count: number;
  alerts_last_90d: number;
  first_time_beneficiary: boolean;
  first_time_country: boolean;
  documentation_gap: boolean;
  adverse_media_flag: boolean;
  jurisdiction_risk_tier: JurisdictionRiskTier;
  // --- Optional fields (all items captured per alert in the product) ---
  alert_title?: string;
  alert_description?: string;
  case_id?: string;
  assigned_analyst?: string;
  case_created_date?: string;
  sla_countdown?: string;
  subject_type?: string;
  subject_business_occupation?: string;
  subject_account_age_months?: number;
  subject_normal_activity?: string;
  recipient_account_id?: string;
  recipient_account_bank?: string;
  date_of_inbound?: string;
  date_of_outbound?: string;
  time_gap_hours?: number;
  total_90d_exposure_beneficiary?: number;
  total_90d_exposure_country?: number;
  pct_outbound_volume_jurisdiction_90d?: number;
  prior_documented_trade_wires_count?: number;
  prior_trade_wires_total?: number;
  average_documented_trade_wire_amount?: number;
  payment_reference_text?: string;
  prior_sar_filings?: boolean;
}

// ---------------------------------------------------------------------------
// Validation error messages (missing or invalid fields)
// ---------------------------------------------------------------------------

export const UPLOAD_ALERT_ERROR_MESSAGES = {
  alert_id: {
    missing: "Missing required field: alert_id",
    invalid: "Invalid alert_id: must be a non-empty string",
  },
  customer_id: {
    missing: "Missing required field: customer_id",
    invalid: "Invalid customer_id: must be a non-empty string",
  },
  customer_name: {
    missing: "Missing required field: customer_name",
    invalid: "Invalid customer_name: must be a non-empty string",
  },
  transaction_type: {
    missing: "Missing required field: transaction_type",
    invalid:
      "Invalid transaction_type: must be one of Wire | ACH | Cash Deposit | Crypto Transfer",
  },
  transaction_date: {
    missing: "Missing required field: transaction_date",
    invalid: "Invalid transaction_date: must be an ISO date (YYYY-MM-DD)",
  },
  transaction_amount: {
    missing: "Missing required field: transaction_amount",
    invalid: "Invalid transaction_amount: must be a number",
  },
  transaction_country: {
    missing: "Missing required field: transaction_country",
    invalid: "Invalid transaction_country: must be a non-empty string",
  },
  beneficiary_name: {
    missing: "Missing required field: beneficiary_name",
    invalid: "Invalid beneficiary_name: must be a non-empty string",
  },
  beneficiary_country: {
    missing: "Missing required field: beneficiary_country",
    invalid: "Invalid beneficiary_country: must be a non-empty string",
  },
  inbound_amount_7d: {
    missing: "Missing required field: inbound_amount_7d",
    invalid: "Invalid inbound_amount_7d: must be a number",
  },
  outbound_7d_total: {
    missing: "Missing required field: outbound_7d_total",
    invalid: "Invalid outbound_7d_total: must be a number",
  },
  outbound_7d_historical_avg: {
    missing: "Missing required field: outbound_7d_historical_avg",
    invalid: "Invalid outbound_7d_historical_avg: must be a number",
  },
  outbound_90d_avg: {
    missing: "Missing required field: outbound_90d_avg",
    invalid: "Invalid outbound_90d_avg: must be a number",
  },
  prior_6m_max_transaction: {
    missing: "Missing required field: prior_6m_max_transaction",
    invalid: "Invalid prior_6m_max_transaction: must be a number",
  },
  risk_rating_onboarding: {
    missing: "Missing required field: risk_rating_onboarding",
    invalid: "Invalid risk_rating_onboarding: must be one of Low | Medium | High",
  },
  risk_rating_current: {
    missing: "Missing required field: risk_rating_current",
    invalid: "Invalid risk_rating_current: must be one of Low | Medium | High",
  },
  prior_sar_count: {
    missing: "Missing required field: prior_sar_count",
    invalid: "Invalid prior_sar_count: must be a number",
  },
  alerts_last_90d: {
    missing: "Missing required field: alerts_last_90d",
    invalid: "Invalid alerts_last_90d: must be a number",
  },
  first_time_beneficiary: {
    missing: "Missing required field: first_time_beneficiary",
    invalid: "Invalid first_time_beneficiary: must be a boolean (true/false)",
  },
  first_time_country: {
    missing: "Missing required field: first_time_country",
    invalid: "Invalid first_time_country: must be a boolean (true/false)",
  },
  documentation_gap: {
    missing: "Missing required field: documentation_gap",
    invalid: "Invalid documentation_gap: must be a boolean (true/false)",
  },
  adverse_media_flag: {
    missing: "Missing required field: adverse_media_flag",
    invalid: "Invalid adverse_media_flag: must be a boolean (true/false)",
  },
  jurisdiction_risk_tier: {
    missing: "Missing required field: jurisdiction_risk_tier",
    invalid:
      "Invalid jurisdiction_risk_tier: must be one of Low | Moderate | Elevated | High",
  },
  alert_title: { missing: "", invalid: "Invalid alert_title" },
  alert_description: { missing: "", invalid: "Invalid alert_description" },
  case_id: { missing: "", invalid: "Invalid case_id" },
  assigned_analyst: { missing: "", invalid: "Invalid assigned_analyst" },
  case_created_date: { missing: "", invalid: "Invalid case_created_date (use YYYY-MM-DD)" },
  sla_countdown: { missing: "", invalid: "Invalid sla_countdown" },
  subject_type: { missing: "", invalid: "Invalid subject_type" },
  subject_business_occupation: { missing: "", invalid: "Invalid subject_business_occupation" },
  subject_account_age_months: { missing: "", invalid: "Invalid subject_account_age_months: must be a number" },
  subject_normal_activity: { missing: "", invalid: "Invalid subject_normal_activity" },
  recipient_account_id: { missing: "", invalid: "Invalid recipient_account_id" },
  recipient_account_bank: { missing: "", invalid: "Invalid recipient_account_bank" },
  date_of_inbound: { missing: "", invalid: "Invalid date_of_inbound (use YYYY-MM-DD)" },
  date_of_outbound: { missing: "", invalid: "Invalid date_of_outbound (use YYYY-MM-DD)" },
  time_gap_hours: { missing: "", invalid: "Invalid time_gap_hours: must be a number" },
  total_90d_exposure_beneficiary: { missing: "", invalid: "Invalid total_90d_exposure_beneficiary: must be a number" },
  total_90d_exposure_country: { missing: "", invalid: "Invalid total_90d_exposure_country: must be a number" },
  pct_outbound_volume_jurisdiction_90d: { missing: "", invalid: "Invalid pct_outbound_volume_jurisdiction_90d: must be a number" },
  prior_documented_trade_wires_count: { missing: "", invalid: "Invalid prior_documented_trade_wires_count: must be a number" },
  prior_trade_wires_total: { missing: "", invalid: "Invalid prior_trade_wires_total: must be a number" },
  average_documented_trade_wire_amount: { missing: "", invalid: "Invalid average_documented_trade_wire_amount: must be a number" },
  payment_reference_text: { missing: "", invalid: "Invalid payment_reference_text" },
  prior_sar_filings: { missing: "", invalid: "Invalid prior_sar_filings: must be true/false" },
} as const;

// ---------------------------------------------------------------------------
// Zod schema (strict: no coercion)
// ---------------------------------------------------------------------------

const transactionTypeSchema = z.enum(TRANSACTION_TYPES, {
  message: UPLOAD_ALERT_ERROR_MESSAGES.transaction_type.invalid,
});

const riskRatingSchema = z.enum(RISK_RATINGS, {
  message: UPLOAD_ALERT_ERROR_MESSAGES.risk_rating_onboarding.invalid,
});

const jurisdictionRiskTierSchema = z.enum(JURISDICTION_RISK_TIERS, {
  message: UPLOAD_ALERT_ERROR_MESSAGES.jurisdiction_risk_tier.invalid,
});

export const uploadedAlertSchema = z.object({
  alert_id: z.string().min(1, UPLOAD_ALERT_ERROR_MESSAGES.alert_id.invalid),
  customer_id: z.string().min(1, UPLOAD_ALERT_ERROR_MESSAGES.customer_id.invalid),
  customer_name: z
    .string()
    .min(1, UPLOAD_ALERT_ERROR_MESSAGES.customer_name.invalid),
  transaction_type: transactionTypeSchema,
  transaction_date: z.iso.date({
    message: UPLOAD_ALERT_ERROR_MESSAGES.transaction_date.invalid,
  }),
  transaction_amount: z.number({
    message: UPLOAD_ALERT_ERROR_MESSAGES.transaction_amount.invalid,
  }),
  transaction_country: z
    .string()
    .min(1, UPLOAD_ALERT_ERROR_MESSAGES.transaction_country.invalid),
  beneficiary_name: z
    .string()
    .min(1, UPLOAD_ALERT_ERROR_MESSAGES.beneficiary_name.invalid),
  beneficiary_country: z
    .string()
    .min(1, UPLOAD_ALERT_ERROR_MESSAGES.beneficiary_country.invalid),
  inbound_amount_7d: z.number({
    message: UPLOAD_ALERT_ERROR_MESSAGES.inbound_amount_7d.invalid,
  }),
  outbound_7d_total: z.number({
    message: UPLOAD_ALERT_ERROR_MESSAGES.outbound_7d_total.invalid,
  }),
  outbound_7d_historical_avg: z.number({
    message: UPLOAD_ALERT_ERROR_MESSAGES.outbound_7d_historical_avg.invalid,
  }),
  outbound_90d_avg: z.number({
    message: UPLOAD_ALERT_ERROR_MESSAGES.outbound_90d_avg.invalid,
  }),
  prior_6m_max_transaction: z.number({
    message: UPLOAD_ALERT_ERROR_MESSAGES.prior_6m_max_transaction.invalid,
  }),
  risk_rating_onboarding: riskRatingSchema,
  risk_rating_current: z.enum(RISK_RATINGS, {
    message: UPLOAD_ALERT_ERROR_MESSAGES.risk_rating_current.invalid,
  }),
  prior_sar_count: z.number({
    message: UPLOAD_ALERT_ERROR_MESSAGES.prior_sar_count.invalid,
  }),
  alerts_last_90d: z.number({
    message: UPLOAD_ALERT_ERROR_MESSAGES.alerts_last_90d.invalid,
  }),
  first_time_beneficiary: z.boolean({
    message: UPLOAD_ALERT_ERROR_MESSAGES.first_time_beneficiary.invalid,
  }),
  first_time_country: z.boolean({
    message: UPLOAD_ALERT_ERROR_MESSAGES.first_time_country.invalid,
  }),
  documentation_gap: z.boolean({
    message: UPLOAD_ALERT_ERROR_MESSAGES.documentation_gap.invalid,
  }),
  adverse_media_flag: z.boolean({
    message: UPLOAD_ALERT_ERROR_MESSAGES.adverse_media_flag.invalid,
  }),
  jurisdiction_risk_tier: jurisdictionRiskTierSchema,
  // Optional fields (all items captured per alert)
  alert_title: z.string().optional(),
  alert_description: z.string().optional(),
  case_id: z.string().optional(),
  assigned_analyst: z.string().optional(),
  case_created_date: z.string().optional(),
  sla_countdown: z.string().optional(),
  subject_type: z.string().optional(),
  subject_business_occupation: z.string().optional(),
  subject_account_age_months: z.number().optional(),
  subject_normal_activity: z.string().optional(),
  recipient_account_id: z.string().optional(),
  recipient_account_bank: z.string().optional(),
  date_of_inbound: z.string().optional(),
  date_of_outbound: z.string().optional(),
  time_gap_hours: z.number().optional(),
  total_90d_exposure_beneficiary: z.number().optional(),
  total_90d_exposure_country: z.number().optional(),
  pct_outbound_volume_jurisdiction_90d: z.number().optional(),
  prior_documented_trade_wires_count: z.number().optional(),
  prior_trade_wires_total: z.number().optional(),
  average_documented_trade_wire_amount: z.number().optional(),
  payment_reference_text: z.string().optional(),
  prior_sar_filings: z.boolean().optional(),
});

export type UploadedAlertInput = z.input<typeof uploadedAlertSchema>;
export type UploadedAlertValidated = z.output<typeof uploadedAlertSchema>;

// ---------------------------------------------------------------------------
// Validator helper: parse one row and return user-facing errors
// ---------------------------------------------------------------------------

/** Map Zod issue code to "missing" vs "invalid" for our error message set. */
function getMessageForIssue(
  path: string,
  code: string,
  defaultMessage: string
): string {
  const key = path as keyof typeof UPLOAD_ALERT_ERROR_MESSAGES;
  const messages = UPLOAD_ALERT_ERROR_MESSAGES[key];
  if (messages) {
    if (code === "invalid_key" || (code === "invalid_type" && defaultMessage.includes("undefined")))
      return messages.missing;
    return messages.invalid;
  }
  return defaultMessage;
}

/**
 * Validates a single alert record and returns either the validated data or
 * an array of user-facing error strings (one per invalid/missing field).
 */
export function validateUploadedAlert(
  row: unknown
): { success: true; data: UploadedAlertValidated } | { success: false; errors: string[] } {
  const result = uploadedAlertSchema.safeParse(row);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    const field = path || "value";
    const custom = getMessageForIssue(
      field,
      issue.code,
      issue.message ?? "Invalid value"
    );
    return `${field}: ${custom}`;
  });
  return { success: false, errors };
}

// ---------------------------------------------------------------------------
// CSV template for import (columns exactly matching UploadedAlert)
// ---------------------------------------------------------------------------

/** Column headers for the CSV template (all items captured per alert). */
export const TEMPLATE_CSV_HEADERS: (keyof UploadedAlert)[] = [
  "alert_id",
  "customer_id",
  "customer_name",
  "transaction_type",
  "transaction_date",
  "transaction_amount",
  "transaction_country",
  "beneficiary_name",
  "beneficiary_country",
  "inbound_amount_7d",
  "outbound_7d_total",
  "outbound_7d_historical_avg",
  "outbound_90d_avg",
  "prior_6m_max_transaction",
  "risk_rating_onboarding",
  "risk_rating_current",
  "prior_sar_count",
  "alerts_last_90d",
  "first_time_beneficiary",
  "first_time_country",
  "documentation_gap",
  "adverse_media_flag",
  "jurisdiction_risk_tier",
  "alert_title",
  "alert_description",
  "case_id",
  "assigned_analyst",
  "case_created_date",
  "sla_countdown",
  "subject_type",
  "subject_business_occupation",
  "subject_account_age_months",
  "subject_normal_activity",
  "recipient_account_id",
  "recipient_account_bank",
  "date_of_inbound",
  "date_of_outbound",
  "time_gap_hours",
  "total_90d_exposure_beneficiary",
  "total_90d_exposure_country",
  "pct_outbound_volume_jurisdiction_90d",
  "prior_documented_trade_wires_count",
  "prior_trade_wires_total",
  "average_documented_trade_wire_amount",
  "payment_reference_text",
  "prior_sar_filings",
];

/** One example row for the template CSV (valid values for every column). */
export const TEMPLATE_CSV_EXAMPLE_ROW: Record<keyof UploadedAlert, string | number | boolean | undefined> = {
  alert_id: "ALRT-IMPORT-001",
  customer_id: "CUST-55001",
  customer_name: "Example Corp",
  transaction_type: "Wire",
  transaction_date: "2024-12-01",
  transaction_amount: 50000,
  transaction_country: "United States",
  beneficiary_name: "Example Beneficiary Ltd",
  beneficiary_country: "Cyprus",
  inbound_amount_7d: 52000,
  outbound_7d_total: 98000,
  outbound_7d_historical_avg: 22000,
  outbound_90d_avg: 18000,
  prior_6m_max_transaction: 45000,
  risk_rating_onboarding: "Medium",
  risk_rating_current: "High",
  prior_sar_count: 0,
  alerts_last_90d: 1,
  first_time_beneficiary: true,
  first_time_country: true,
  documentation_gap: true,
  adverse_media_flag: false,
  jurisdiction_risk_tier: "Elevated",
  alert_title: "Unusual outbound wire to high-risk jurisdiction",
  alert_description: "Outbound wire materially exceeds historical baseline; stated purpose trade settlement; no supporting documentation on file.",
  case_id: "CR-2025-0842",
  assigned_analyst: "J. Chen",
  case_created_date: "2025-02-14",
  sla_countdown: "2d 4h remaining",
  subject_type: "Corporate (Freight & Logistics)",
  subject_business_occupation: "Import/export trading",
  subject_account_age_months: 18,
  subject_normal_activity: "Avg monthly outbound $15k-$20k, mostly wires/ACH",
  recipient_account_id: "CY9876543210",
  recipient_account_bank: "Bank of Cyprus",
  date_of_inbound: "2024-11-15",
  date_of_outbound: "2024-11-18",
  time_gap_hours: 68,
  total_90d_exposure_beneficiary: 47892,
  total_90d_exposure_country: 98400,
  pct_outbound_volume_jurisdiction_90d: 58,
  prior_documented_trade_wires_count: 12,
  prior_trade_wires_total: 14,
  average_documented_trade_wire_amount: 11200,
  payment_reference_text: "Invoice #INV-2024-8821 - Trade settlement",
  prior_sar_filings: false,
};

/** Build CSV string for template download (header + one example row). */
export function getTemplateCsvContent(): string {
  const header = TEMPLATE_CSV_HEADERS.join(",");
  const row = TEMPLATE_CSV_HEADERS.map((k) => {
    const v = TEMPLATE_CSV_EXAMPLE_ROW[k];
    if (v === undefined || v === null) return "";
    if (typeof v === "string" && (v.includes(",") || v.includes('"') || v.includes("\n")))
      return `"${v.replace(/"/g, '""')}"`;
    return String(v);
  }).join(",");
  return [header, row].join("\n");
}
