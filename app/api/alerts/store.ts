/**
 * In-memory store for the latest batch of processed alerts (from CSV upload).
 * GET /api/alerts returns this; POST /api/upload-alerts replaces it.
 */

import type { ProcessedAlert } from "@/app/api/upload-alerts/route";

let storedAlerts: ProcessedAlert[] = [];

export function getStoredAlerts(): ProcessedAlert[] {
  return storedAlerts;
}

export function setStoredAlerts(alerts: ProcessedAlert[]): void {
  storedAlerts = alerts;
}
