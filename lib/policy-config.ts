/**
 * Policy configuration for escalation triggers.
 * Stored in localStorage; used by the main case page and editable on the Policy Configuration page.
 *
 * All triggers (predefined and custom) use the same unified schema and are evaluated
 * via the case field registry and rule evaluation engine.
 */

export type UnifiedTriggerConfig = {
  id: string;
  name: string;
  fieldKey: string;
  operator: string;
  /** number, string (for enum), or boolean. For boolean fields, threshold is not used (trigger fires when value === true). */
  threshold: number | string | boolean;
  critical: boolean;
  enabled: boolean;
  type: "predefined" | "custom";
};

export type PolicyConfig = {
  triggers: UnifiedTriggerConfig[];
  minRegularTriggersToEscalate: number;
};

const STORAGE_KEY = "aml-policy-config";

/** Canonical default policy (server-side single source of truth). Escalate when ≥ N regular triggers met OR any Critical met. */
const PREDEFINED_DEFAULTS: Record<
  string,
  { name: string; fieldKey: string; operator: string; threshold: number | string | boolean; critical: boolean }
> = {
  first_time_beneficiary: { name: "First-time beneficiary", fieldKey: "firstTimeBeneficiary", operator: "boolean_true", threshold: true, critical: true },
  elevated_risk_jurisdiction: { name: "Elevated-risk jurisdiction", fieldKey: "destinationJurisdictionRiskTier", operator: "gte", threshold: "Elevated (FATF monitored)", critical: true },
  rapid_movement: { name: "Rapid movement (hours)", fieldKey: "rapidMovementHours", operator: "<", threshold: 72, critical: true },
  documentation_gap: { name: "Documentation gap", fieldKey: "documentationGap", operator: "boolean_true", threshold: true, critical: false },
  corridor_novelty: { name: "First time country", fieldKey: "firstTimeCountry", operator: "boolean_true", threshold: true, critical: false },
  risk_rating_elevated: { name: "Risk Rating Elevated", fieldKey: "riskRatingElevated", operator: "boolean_true", threshold: true, critical: false },
  velocity_spike: { name: "Velocity Spike (7d multiple)", fieldKey: "velocity7dMultiple", operator: ">", threshold: 3, critical: false },
  concentration_risk: { name: "Concentration Risk (%)", fieldKey: "concentrationPercent", operator: ">", threshold: 50, critical: false },
  negative_media_risk: { name: "Negative Media Risk", fieldKey: "negativeMediaRisk", operator: "boolean_true", threshold: true, critical: true },
};

const PREDEFINED_IDS = Object.keys(PREDEFINED_DEFAULTS);

function defaultUnifiedTriggers(): UnifiedTriggerConfig[] {
  return PREDEFINED_IDS.map((id) => {
    const d = PREDEFINED_DEFAULTS[id];
    return {
      id,
      name: d.name,
      fieldKey: d.fieldKey,
      operator: d.operator,
      threshold: d.threshold,
      critical: d.critical,
      enabled: true,
      type: "predefined",
    };
  });
}

/** Canonical default policy configuration (single source of truth). Used for Reset to Default and initial load. */
export function getDefaultPolicyConfig(): PolicyConfig {
  return {
    minRegularTriggersToEscalate: 4,
    triggers: defaultUnifiedTriggers(),
  };
}

/** Canonical default as JSON string for storage/reference. */
export function getDefaultPolicyConfigJSON(): string {
  return JSON.stringify(getDefaultPolicyConfig(), null, 2);
}

function isUnifiedTrigger(t: unknown): t is UnifiedTriggerConfig {
  return (
    typeof t === "object" &&
    t !== null &&
    "id" in t &&
    "name" in t &&
    "fieldKey" in t &&
    "operator" in t &&
    "threshold" in t &&
    "critical" in t &&
    "enabled" in t &&
    "type" in t
  );
}

/** Migrate legacy trigger format to unified format. Predefined triggers always sync name/fieldKey/operator/threshold/critical from PREDEFINED_DEFAULTS so the UI shows current labels. */
function migrateTrigger(legacy: unknown): UnifiedTriggerConfig | null {
  const o = legacy as Record<string, unknown>;
  const id = String(o?.id ?? "");
  const predefined = PREDEFINED_DEFAULTS[id];
  if (predefined) {
    return {
      id,
      name: predefined.name,
      fieldKey: predefined.fieldKey,
      operator: (o.operator as string) ?? (o.comparisonOperator as string) ?? predefined.operator,
      threshold: typeof o.threshold !== "undefined" ? (o.threshold as number | string | boolean) : (typeof o.thresholdValue !== "undefined" ? (o.thresholdValue as number) : predefined.threshold),
      critical: Boolean(typeof o.critical !== "undefined" ? o.critical : o.isCritical ?? predefined.critical),
      enabled: Boolean(o.enabled !== false),
      type: "predefined",
    };
  }
  if (isUnifiedTrigger(legacy)) return legacy as UnifiedTriggerConfig;
  return null;
}

export function getPolicyConfig(): PolicyConfig {
  if (typeof window === "undefined") return getDefaultPolicyConfig();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultPolicyConfig();
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const defaults = getDefaultPolicyConfig();
    const minN =
      typeof parsed.minRegularTriggersToEscalate === "number"
        ? parsed.minRegularTriggersToEscalate
        : defaults.minRegularTriggersToEscalate;

    let triggers: UnifiedTriggerConfig[] = [];
    /** Trigger ids that have been removed from the product; strip them when loading so they never appear. */
    const REMOVED_TRIGGER_IDS = new Set(["prior_sar_alert_history"]);
    if (Array.isArray(parsed.triggers)) {
      const migrated = parsed.triggers.map((t: unknown) => migrateTrigger(t)).filter(Boolean) as UnifiedTriggerConfig[];
      const seen = new Set<string>();
      for (const t of migrated) {
        if (REMOVED_TRIGGER_IDS.has(t.id)) continue;
        if (!seen.has(t.id)) {
          seen.add(t.id);
          triggers.push(t);
        }
      }
      const defaultIds = new Set(PREDEFINED_IDS);
      for (const id of PREDEFINED_IDS) {
        if (!seen.has(id)) {
          const d = PREDEFINED_DEFAULTS[id];
          triggers.push({
            id,
            name: d.name,
            fieldKey: d.fieldKey,
            operator: d.operator,
            threshold: d.threshold,
            critical: d.critical,
            enabled: true,
            type: "predefined",
          });
        }
      }
      triggers = triggers.sort((a, b) => {
        const aPre = a.type === "predefined" ? 0 : 1;
        const bPre = b.type === "predefined" ? 0 : 1;
        if (aPre !== bPre) return aPre - bPre;
        const aIdx = PREDEFINED_IDS.indexOf(a.id);
        const bIdx = PREDEFINED_IDS.indexOf(b.id);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        return 0;
      });
    } else {
      triggers = defaultUnifiedTriggers();
    }

    return { triggers, minRegularTriggersToEscalate: minN };
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
