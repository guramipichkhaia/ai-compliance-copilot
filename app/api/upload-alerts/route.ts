import { NextResponse } from "next/server";
import Papa from "papaparse";
import {
  validateUploadedAlert,
  type UploadedAlertValidated,
} from "@/lib/aml-alert-upload-schema";
import { evaluateAlert, type EvaluatedAlert } from "@/lib/alert-evaluator";
import { getDefaultPolicyConfig } from "@/lib/policy-config";

export const runtime = "nodejs";

const CSV_MIME_TYPES = [
  "text/csv",
  "application/csv",
  "text/plain",
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/** Numeric column names from the UploadedAlert schema (required). */
const NUMERIC_KEYS = new Set([
  "transaction_amount",
  "inbound_amount_7d",
  "outbound_7d_total",
  "outbound_7d_historical_avg",
  "outbound_90d_avg",
  "prior_6m_max_transaction",
  "prior_sar_count",
  "alerts_last_90d",
]);

/** Optional numeric columns (empty string → omit/undefined for Zod). */
const OPTIONAL_NUMERIC_KEYS = new Set([
  "subject_account_age_months",
  "time_gap_hours",
  "total_90d_exposure_beneficiary",
  "total_90d_exposure_country",
  "pct_outbound_volume_jurisdiction_90d",
  "prior_documented_trade_wires_count",
  "prior_trade_wires_total",
  "average_documented_trade_wire_amount",
]);

/** Boolean column names from the UploadedAlert schema (required). */
const BOOLEAN_KEYS = new Set([
  "first_time_beneficiary",
  "first_time_country",
  "documentation_gap",
  "adverse_media_flag",
]);

/** Optional boolean columns (empty string → omit for Zod). */
const OPTIONAL_BOOLEAN_KEYS = new Set(["prior_sar_filings"]);

function coerceRow(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    const str = value == null ? "" : String(value).trim();
    if (NUMERIC_KEYS.has(key)) {
      const n = str === "" ? NaN : Number(str);
      out[key] = n;
    } else if (OPTIONAL_NUMERIC_KEYS.has(key)) {
      if (str === "") continue;
      const n = Number(str);
      if (!Number.isNaN(n)) out[key] = n;
    } else if (BOOLEAN_KEYS.has(key)) {
      const lower = str.toLowerCase();
      out[key] =
        lower === "true" || lower === "1" || lower === "yes";
    } else if (OPTIONAL_BOOLEAN_KEYS.has(key)) {
      if (str === "") continue;
      const lower = str.toLowerCase();
      out[key] = lower === "true" || lower === "1" || lower === "yes";
    } else {
      out[key] = str;
    }
  }
  return out;
}

/** Per-alert: raw uploaded data + evaluated trigger results, escalation, timestamp. */
export type ProcessedAlert = EvaluatedAlert & {
  raw_alert: UploadedAlertValidated;
};

export type UploadAlertsResponse =
  | {
      ok: true;
      processed_alerts: ProcessedAlert[];
      summary: {
        total_alerts: number;
        escalation_recommended_count: number;
        dismissal_recommended_count: number;
      };
      validationErrors: { rowIndex: number; row: number; errors: string[] }[];
    }
  | { ok: false; error: string };

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { ok: false, error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid file field: expected 'file'" },
        { status: 400 }
      );
    }

    const name = file.name.toLowerCase();
    const isCsv =
      name.endsWith(".csv") ||
      CSV_MIME_TYPES.some((m) => file.type === m);
    if (!isCsv) {
      return NextResponse.json(
        { ok: false, error: "Only CSV files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: `File size exceeds ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB`,
        },
        { status: 400 }
      );
    }

    const text = await file.text();
    const parseResult = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    if (parseResult.errors.length > 0) {
      const first = parseResult.errors[0];
      return NextResponse.json(
        {
          ok: false,
          error: `CSV parse error at row ${first.row}: ${first.message}`,
        },
        { status: 400 }
      );
    }

    const rows = parseResult.data;
    const validAlerts: UploadedAlertValidated[] = [];
    const validationErrors: {
      rowIndex: number;
      row: number;
      errors: string[];
    }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i] as Record<string, unknown>;
      const coerced = coerceRow(raw);
      const result = validateUploadedAlert(coerced);
      if (result.success) {
        validAlerts.push(result.data);
      } else {
        validationErrors.push({
          rowIndex: i,
          row: i + 2, // 1-based data row (skip header)
          errors: result.errors,
        });
      }
    }

    const policyConfig = getDefaultPolicyConfig();
    // Each valid row is evaluated; attach triggers, counts, and governance so the frontend receives fully evaluated alerts (not raw rows).
    const processed_alerts: ProcessedAlert[] = validAlerts.map((raw_alert) => {
      const evaluation = evaluateAlert(raw_alert, policyConfig);
      return {
        raw_alert,
        triggers: evaluation.triggers,
        triggers_met_count: evaluation.triggers_met_count,
        escalation_recommended: evaluation.escalation_recommended,
        evaluation_timestamp: evaluation.evaluation_timestamp,
        policy_version: evaluation.policy_version,
      };
    });

    const escalation_recommended_count = processed_alerts.filter(
      (a) => a.escalation_recommended
    ).length;
    const total_alerts = processed_alerts.length;

    const { setStoredAlerts } = await import("@/app/api/alerts/store");
    setStoredAlerts(processed_alerts);

    const response: UploadAlertsResponse = {
      ok: true,
      processed_alerts,
      summary: {
        total_alerts,
        escalation_recommended_count,
        dismissal_recommended_count: total_alerts - escalation_recommended_count,
      },
      validationErrors,
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
