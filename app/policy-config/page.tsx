"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPolicyConfig,
  savePolicyConfig,
  getDefaultPolicyConfig,
  type PolicyConfig,
  type TriggerConfig,
  type TriggerThresholdUnit,
  type ComparisonOperator,
} from "@/lib/policy-config";

const COMPARISON_OPERATORS: { value: ComparisonOperator; label: string }[] = [
  { value: ">", label: ">" },
  { value: ">=", label: "≥" },
  { value: "<", label: "<" },
  { value: "<=", label: "≤" },
  { value: "=", label: "=" },
];

const THRESHOLD_UNITS: { value: TriggerThresholdUnit; label: string }[] = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "amount", label: "Amount ($)" },
  { value: "hours", label: "Hours" },
  { value: "count", label: "Count" },
  { value: "multiplier", label: "Multiplier (×)" },
  { value: "percentile", label: "Percentile" },
  { value: "boolean", label: "Boolean (on/off)" },
];

function TriggerRow({
  number,
  trigger,
  onChange,
  onRemove,
  canRemove,
}: {
  number: number;
  trigger: TriggerConfig;
  onChange: (t: TriggerConfig) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const hasThreshold = trigger.thresholdUnit !== "boolean";
  const hasCriticalThreshold = trigger.thresholdUnit === "hours" && trigger.type === "predefined";
  const hasNumericOperator = hasThreshold;

  return (
    <tr className="border-b border-neutral-200 hover:bg-neutral-50/50">
      <td className="py-3 pl-4 pr-2 w-10 text-neutral-500 tabular-nums text-sm font-medium">
        {number}
      </td>
      <td className="py-3 pr-2">
        {trigger.type === "custom" ? (
          <input
            type="text"
            value={trigger.label}
            onChange={(e) => onChange({ ...trigger, label: e.target.value })}
            className="rounded border border-neutral-300 px-2 py-1 text-sm font-medium w-48"
            placeholder="Trigger name"
          />
        ) : (
          <span className="font-medium text-neutral-900">{trigger.label}</span>
        )}
        {trigger.type === "custom" && (
          <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">Custom</span>
        )}
      </td>
      <td className="py-3 px-2">
        {hasThreshold ? (
          <input
            type="number"
            min={0}
            step={trigger.thresholdUnit === "percentage" || trigger.thresholdUnit === "percentile" ? 1 : trigger.thresholdUnit === "multiplier" ? 0.1 : 1}
            value={trigger.thresholdValue}
            onChange={(e) => onChange({ ...trigger, thresholdValue: parseFloat(e.target.value) || 0 })}
            className="w-24 rounded border border-neutral-300 px-2 py-1.5 text-sm tabular-nums"
          />
        ) : (
          <span className="text-neutral-500 text-sm">—</span>
        )}
      </td>
      <td className="py-3 px-2">
        {trigger.type === "predefined" ? (
          <span className="text-neutral-600 text-sm">{trigger.thresholdUnit}</span>
        ) : (
          <select
            value={trigger.thresholdUnit}
            onChange={(e) => onChange({ ...trigger, thresholdUnit: e.target.value as TriggerThresholdUnit })}
            className="rounded border border-neutral-300 px-2 py-1.5 text-sm"
          >
            {THRESHOLD_UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        )}
      </td>
      <td className="py-3 px-2">
        {hasNumericOperator ? (
          <select
            value={trigger.comparisonOperator ?? "="}
            onChange={(e) => onChange({ ...trigger, comparisonOperator: e.target.value as ComparisonOperator })}
            className="rounded border border-neutral-300 px-2 py-1.5 text-sm w-14"
          >
            {COMPARISON_OPERATORS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <span className="text-neutral-400 text-sm">—</span>
        )}
      </td>
      <td className="py-3 px-2">
        {hasCriticalThreshold ? (
          <input
            type="number"
            min={0}
            value={trigger.criticalThresholdValue ?? ""}
            placeholder="Optional"
            onChange={(e) => onChange({ ...trigger, criticalThresholdValue: e.target.value === "" ? null : parseFloat(e.target.value) || 0 })}
            className="w-20 rounded border border-neutral-300 px-2 py-1.5 text-sm tabular-nums"
          />
        ) : (
          <span className="text-neutral-400">—</span>
        )}
      </td>
      <td className="py-3 px-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={trigger.isCritical}
            onChange={(e) => onChange({ ...trigger, isCritical: e.target.checked })}
            className="h-4 w-4 rounded border-neutral-300"
          />
          <span className="text-sm text-neutral-700">{trigger.isCritical ? "Critical" : "Regular"}</span>
        </label>
      </td>
      <td className="py-3 px-2">
        {trigger.type === "custom" ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={trigger.enabled}
              onChange={(e) => onChange({ ...trigger, enabled: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <span className="text-sm text-neutral-600">Enabled</span>
          </label>
        ) : (
          <span className="text-neutral-400 text-sm">—</span>
        )}
      </td>
      <td className="py-3 pl-2">
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded text-red-600 hover:bg-red-50 px-2 py-1 text-sm"
          >
            Remove
          </button>
        )}
      </td>
    </tr>
  );
}

export default function PolicyConfigPage() {
  const [config, setConfig] = useState<PolicyConfig>(getDefaultPolicyConfig());
  const [saved, setSaved] = useState(false);
  const [saveButtonJustSaved, setSaveButtonJustSaved] = useState(false);

  useEffect(() => {
    setConfig(getPolicyConfig());
  }, []);

  const updateTrigger = (index: number, next: TriggerConfig) => {
    setConfig((c) => ({
      ...c,
      triggers: c.triggers.map((t, i) => (i === index ? next : t)),
    }));
    setSaved(false);
  };

  const removeTrigger = (index: number) => {
    const t = config.triggers[index];
    if (t.type !== "custom") return;
    setConfig((c) => ({
      ...c,
      triggers: c.triggers.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const addCustomTrigger = () => {
    const existingIds = new Set(config.triggers.map((t) => t.id));
    let nextId = `custom_${Date.now()}`;
    while (existingIds.has(nextId)) nextId = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setConfig((c) => ({
      ...c,
      triggers: [
        ...c.triggers,
        {
          id: nextId,
          label: "New custom trigger",
          type: "custom",
          thresholdValue: 0,
          thresholdUnit: "percentage",
          comparisonOperator: ">" as const,
          criticalThresholdValue: null,
          isCritical: false,
          enabled: true,
        },
      ],
    }));
    setSaved(false);
  };

  /**
   * When the user clicks "Save Configuration," gather all predefined and custom triggers,
   * including threshold values, critical toggles, and escalation counts. Update the trigger
   * configuration object in memory, then persist it to your backend or local storage. Ensure
   * that each trigger is uniquely associated with its ID, so cards can reference it dynamically.
   */
  const handleSave = () => {
    const gathered = config.triggers.map((t) => ({
      id: t.id,
      label: t.label,
      type: t.type,
      thresholdValue: t.thresholdValue,
      thresholdUnit: t.thresholdUnit,
      comparisonOperator: t.comparisonOperator ?? "=",
      criticalThresholdValue: t.criticalThresholdValue,
      isCritical: t.isCritical,
      enabled: t.enabled,
    }));
    const seenIds = new Set<string>();
    const triggers = gathered.filter((t) => {
      if (seenIds.has(t.id)) return false;
      seenIds.add(t.id);
      return true;
    });
    const triggerConfig: PolicyConfig = {
      minRegularTriggersToEscalate: config.minRegularTriggersToEscalate,
      triggers,
    };
    setConfig(triggerConfig);
    savePolicyConfig(triggerConfig);
    setSaved(true);
    setSaveButtonJustSaved(true);
    setTimeout(() => setSaveButtonJustSaved(false), 2500);
    setTimeout(() => setSaved(false), 3500);
  };

  const regularCount = config.triggers.filter((t) => !t.isCritical && t.enabled).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-neutral-600 hover:text-neutral-900 text-sm font-medium">
              ← Back to Alerts
            </Link>
            <h1 className="text-xl font-semibold text-neutral-900">Policy Configuration</h1>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              saveButtonJustSaved
                ? "bg-emerald-600 text-white"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
          >
            {saveButtonJustSaved ? "✓ Saved" : "Save configuration"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {saved && (
          <div
            role="alert"
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-lg"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">✓</span>
            <div>
              <p className="font-semibold">Configuration saved</p>
              <p className="text-sm text-emerald-700">Your triggers and escalation rules have been stored. The case page will use these settings at runtime.</p>
            </div>
          </div>
        )}
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Escalation rule
          </h2>
          <p className="text-sm text-neutral-700 mb-3">
            Escalate when <strong>at least N</strong> regular triggers are met, or <strong>any</strong> trigger marked as Critical is met.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <span className="text-sm text-neutral-700">Min regular triggers to escalate:</span>
              <input
                type="number"
                min={1}
                max={config.triggers.length}
                value={config.minRegularTriggersToEscalate}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!Number.isNaN(n)) {
                    setConfig((c) => ({ ...c, minRegularTriggersToEscalate: n }));
                    setSaved(false);
                  }
                }}
                className="w-16 rounded border border-neutral-300 px-2 py-1.5 text-sm tabular-nums"
              />
            </label>
            <span className="text-neutral-500 text-sm">
              (e.g. &quot;{config.minRegularTriggersToEscalate} out of {regularCount}&quot; regular triggers)
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Triggers
            </h2>
            <button
              type="button"
              onClick={addCustomTrigger}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              + Add custom trigger
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80">
                  <th className="py-2.5 pr-2 pl-4 text-xs font-semibold uppercase text-neutral-500 w-10">#</th>
                  <th className="py-2.5 pr-2 text-xs font-semibold uppercase text-neutral-500">Trigger</th>
                  <th className="py-2.5 px-2 text-xs font-semibold uppercase text-neutral-500">Threshold</th>
                  <th className="py-2.5 px-2 text-xs font-semibold uppercase text-neutral-500">Unit</th>
                  <th className="py-2.5 px-2 text-xs font-semibold uppercase text-neutral-500">Operator</th>
                  <th className="py-2.5 px-2 text-xs font-semibold uppercase text-neutral-500">Critical under (e.g. hours)</th>
                  <th className="py-2.5 px-2 text-xs font-semibold uppercase text-neutral-500">Type</th>
                  <th className="py-2.5 px-2 text-xs font-semibold uppercase text-neutral-500">Enabled</th>
                  <th className="py-2.5 pl-2 text-xs font-semibold uppercase text-neutral-500"></th>
                </tr>
              </thead>
              <tbody>
                {config.triggers.map((trigger, index) => (
                  <TriggerRow
                    key={trigger.id}
                    number={index + 1}
                    trigger={trigger}
                    onChange={(t) => updateTrigger(index, t)}
                    onRemove={() => removeTrigger(index)}
                    canRemove={trigger.type === "custom"}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          Custom triggers are stored but not evaluated on the case page (no data source). Predefined triggers are evaluated using case data and the thresholds above.
        </p>
      </main>
    </div>
  );
}
