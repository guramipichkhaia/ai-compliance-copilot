import { NextResponse } from "next/server";
import { getStoredAlerts } from "./store";

/**
 * GET /api/alerts — returns the current list of fully evaluated alerts (from last CSV upload).
 * Each alert includes triggers, triggers_met_count, escalation_recommended, evaluation_timestamp, policy_version, and raw_alert.
 */
export async function GET() {
  const processed_alerts = getStoredAlerts();
  return NextResponse.json({
    ok: true,
    processed_alerts,
    summary: {
      total_alerts: processed_alerts.length,
      escalation_recommended_count: processed_alerts.filter((a) => a.escalation_recommended).length,
      dismissal_recommended_count: processed_alerts.filter((a) => !a.escalation_recommended).length,
    },
  });
}
