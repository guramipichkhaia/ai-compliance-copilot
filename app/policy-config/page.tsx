"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getPolicyConfig,
  savePolicyConfig,
  getDefaultPolicyConfig,
  type PolicyConfig,
  type UnifiedTriggerConfig,
} from "@/lib/policy-config";
import {
  getCards,
  getFieldByKey,
  getOperatorsForField,
  searchFields,
  type CaseFieldDef,
} from "@/lib/case-field-registry";

function generateTriggerId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** For boolean fields we do not show threshold; trigger always fires when value === true. */
function ThresholdInput({
  fieldKey,
  value,
  onChange,
  disabled,
}: {
  fieldKey: string;
  value: number | string | boolean;
  onChange: (v: number | string | boolean) => void;
  disabled?: boolean;
}) {
  const field = getFieldByKey(fieldKey);
  if (!field) {
    return (
      <input
        type="number"
        value={typeof value === "number" ? value : ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        className="w-16 rounded border border-neutral-300 px-1.5 py-1 text-[13px] tabular-nums"
      />
    );
  }
  if (field.type === "boolean") {
    return <span className="text-neutral-500 text-[13px]">—</span>;
  }
  if (field.type === "enum" && field.options) {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded border border-neutral-300 px-1.5 py-1 text-[13px] min-w-[140px]"
      >
        {field.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }
  const isPercent = field.unit === "%" || field.type === "percentage";
  const numVal = typeof value === "number" ? value : parseFloat(String(value)) || 0;
  return (
    <span className="inline-flex items-center gap-0.5">
      <input
        type="number"
        value={numVal}
        step={isPercent ? 1 : 0.1}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        className="w-16 rounded border border-neutral-300 px-1.5 py-1 text-[13px] tabular-nums"
      />
      {(isPercent && <span className="text-neutral-500 text-[13px]">%</span>) || (field.unit && <span className="text-neutral-500 text-[13px]">{field.unit}</span>)}
    </span>
  );
}

function UnitDisplay({ fieldKey }: { fieldKey: string }) {
  const field = getFieldByKey(fieldKey);
  if (!field?.unit) return <span className="text-neutral-400 text-[13px]">—</span>;
  return <span className="text-neutral-600 text-[13px]">{field.unit}</span>;
}

type FieldOption = { cardTitle: string; field: CaseFieldDef };

function FieldPickerDropdown({
  value,
  onSelect,
  disabled,
}: {
  value: string;
  onSelect: (fieldKey: string, field: CaseFieldDef) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const cards = getCards();
  const allOptions: FieldOption[] = query.trim()
    ? searchFields(query).map((r) => ({ cardTitle: r.cardTitle, field: r.field }))
    : cards.flatMap((c) => c.fields.map((f) => ({ cardTitle: c.cardTitle, field: f })));

  const currentLabel = getFieldByKey(value)?.label ?? value;

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setHighlightedIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>("[data-field-key]");
    const node = focusable[highlightedIndex];
    node?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open, allOptions.length]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => (i + 1) % allOptions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => (i - 1 + allOptions.length) % allOptions.length);
        return;
      }
      if (e.key === "Enter" && allOptions[highlightedIndex]) {
        e.preventDefault();
        onSelect(allOptions[highlightedIndex].field.key, allOptions[highlightedIndex].field);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, highlightedIndex, allOptions, onSelect]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative min-w-[200px]">
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="w-full rounded border border-neutral-300 px-1.5 py-1 text-left text-[13px] min-w-[200px] bg-white hover:bg-neutral-50 disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {currentLabel}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 z-50 mt-0.5 w-full max-w-[320px] rounded-lg border border-neutral-200 bg-white shadow-lg overflow-hidden"
          role="listbox"
        >
          <div className="p-1.5 border-b border-neutral-100">
            <input
              type="search"
              placeholder="Search fields..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full rounded border border-neutral-300 px-2 py-1.5 text-[13px]"
              autoFocus
            />
          </div>
          <div ref={listRef} className="max-h-[280px] overflow-y-auto py-1">
            {allOptions.length === 0 ? (
              <p className="px-3 py-2 text-[13px] text-neutral-500">No fields match.</p>
            ) : (
              (() => {
                let lastTitle = "";
                return allOptions.map(({ cardTitle, field: f }, idx) => {
                  const isHeader = cardTitle !== lastTitle;
                  if (isHeader) lastTitle = cardTitle;
                  const isHighlighted = idx === highlightedIndex;
                  return (
                    <div key={f.key}>
                      {isHeader && (
                        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-50 border-t border-neutral-100 first:border-t-0">
                          {cardTitle}
                        </div>
                      )}
                      <button
                        type="button"
                        data-field-key={f.key}
                        role="option"
                        aria-selected={value === f.key}
                        onClick={() => {
                          onSelect(f.key, f);
                          setOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`w-full text-left px-3 py-1.5 pl-5 text-[13px] ${isHighlighted ? "bg-neutral-100" : "hover:bg-neutral-50"} ${value === f.key ? "font-medium text-neutral-900" : "text-neutral-700"}`}
                      >
                        {f.label}
                      </button>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TriggerRow({
  number,
  trigger,
  onChange,
  onRemove,
}: {
  number: number;
  trigger: UnifiedTriggerConfig;
  onChange: (t: UnifiedTriggerConfig) => void;
  onRemove: () => void;
}) {
  const isPredefined = trigger.type === "predefined";
  const operators = getOperatorsForField(trigger.fieldKey);

  return (
    <tr className="border-b border-neutral-200 hover:bg-neutral-50/50">
      <td className="py-1.5 pl-3 pr-1.5 w-8 text-neutral-500 tabular-nums text-[13px] font-medium">
        {number}
      </td>
      <td className="py-1.5 pr-1.5">
        {isPredefined ? (
          <span className="font-medium text-neutral-900 text-[13px]">{trigger.name}</span>
        ) : (
          <input
            type="text"
            value={trigger.name}
            onChange={(e) => onChange({ ...trigger, name: e.target.value })}
            className="rounded border border-neutral-300 px-1.5 py-0.5 text-[13px] font-medium w-36"
            placeholder="Trigger name"
          />
        )}
        {!isPredefined && (
          <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[11px] text-amber-800">Custom</span>
        )}
      </td>
      <td className="py-1.5 px-1.5">
        {isPredefined ? (
          <span className="text-neutral-700 text-[13px]">{getFieldByKey(trigger.fieldKey)?.label ?? trigger.fieldKey}</span>
        ) : (
          <FieldPickerDropdown
            value={trigger.fieldKey}
            onSelect={(fieldKey, f) => {
              const defaultVal = f.type === "boolean" ? true : f.type === "enum" && f.options?.[0] ? f.options[0] : 0;
              const ops = getOperatorsForField(fieldKey);
              onChange({
                ...trigger,
                fieldKey,
                operator: f.type === "boolean" ? "boolean_true" : (ops[0]?.value ?? ">"),
                threshold: defaultVal,
              });
            }}
          />
        )}
      </td>
      <td className="py-1.5 px-1.5">
        {getFieldByKey(trigger.fieldKey)?.type === "boolean" ? (
          <span className="text-neutral-600 text-[13px]">is true</span>
        ) : (
          <select
            value={trigger.operator}
            onChange={(e) => onChange({ ...trigger, operator: e.target.value })}
            className="rounded border border-neutral-300 px-1.5 py-1 text-[13px] w-16"
          >
            {operators.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </td>
      <td className="py-1.5 px-1.5">
        {getFieldByKey(trigger.fieldKey)?.type === "boolean" ? (
          <span className="text-neutral-400 text-[13px]">—</span>
        ) : (
          <ThresholdInput
            fieldKey={trigger.fieldKey}
            value={trigger.threshold}
            onChange={(v) => onChange({ ...trigger, threshold: v })}
          />
        )}
      </td>
      <td className="py-1.5 px-1.5">
        {getFieldByKey(trigger.fieldKey)?.type === "boolean" ? (
          <span className="text-neutral-400 text-[13px]">—</span>
        ) : (
          <UnitDisplay fieldKey={trigger.fieldKey} />
        )}
      </td>
      <td className="py-1.5 px-1.5">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={trigger.critical}
            onChange={(e) => onChange({ ...trigger, critical: e.target.checked })}
            className="h-3.5 w-3.5 rounded border-neutral-300"
          />
          <span className={`inline-flex items-center gap-1 text-[13px] ${trigger.critical ? "text-amber-700" : "text-neutral-600"}`}>
            <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${trigger.critical ? "bg-amber-500" : "bg-neutral-400"}`} aria-hidden />
            {trigger.critical ? "Critical" : "Regular"}
          </span>
        </label>
      </td>
      <td className="py-1.5 px-1.5">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={trigger.enabled}
            onChange={(e) => onChange({ ...trigger, enabled: e.target.checked })}
            className="h-3.5 w-3.5 rounded border-neutral-300"
          />
          <span className="text-[13px] text-neutral-600">Enabled</span>
        </label>
      </td>
      <td className="py-1.5 pl-1.5">
        {!isPredefined && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded text-red-600 hover:bg-red-50 px-1.5 py-0.5 text-[13px]"
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
  const [escalationRuleOpen, setEscalationRuleOpen] = useState(false);

  useEffect(() => {
    setConfig(getPolicyConfig());
  }, []);

  const updateTrigger = (index: number, next: UnifiedTriggerConfig) => {
    setConfig((c) => ({
      ...c,
      triggers: c.triggers.map((t, i) => (i === index ? next : t)),
    }));
    setSaved(false);
  };

  const removeTrigger = (index: number) => {
    const t = config.triggers[index];
    if (t?.type === "predefined") return;
    setConfig((c) => ({
      ...c,
      triggers: c.triggers.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const addNewTrigger = () => {
    const cards = getCards();
    const firstField = cards[0]?.fields[0];
    const key = firstField?.key ?? "totalOutbound7d";
    const f = firstField ?? getFieldByKey(key);
    const ops = getOperatorsForField(key);
    const defaultVal = f?.type === "boolean" ? true : f?.type === "enum" && f?.options?.[0] ? f.options[0] : 0;
    const newTrigger: UnifiedTriggerConfig = {
      id: generateTriggerId(),
      name: "New trigger",
      fieldKey: key,
      operator: f?.type === "boolean" ? "boolean_true" : (ops[0]?.value ?? ">"),
      threshold: defaultVal,
      critical: false,
      enabled: true,
      type: "custom",
    };
    setConfig((c) => ({
      ...c,
      triggers: [...c.triggers, newTrigger],
    }));
    setSaved(false);
  };

  const resetToDefaultPolicy = () => {
    const defaultConfig = getDefaultPolicyConfig();
    setConfig(defaultConfig);
    savePolicyConfig(defaultConfig);
    setSaved(true);
    setSaveButtonJustSaved(true);
    setTimeout(() => setSaveButtonJustSaved(false), 2500);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleSave = () => {
    savePolicyConfig(config);
    setSaved(true);
    setSaveButtonJustSaved(true);
    setTimeout(() => setSaveButtonJustSaved(false), 2500);
    setTimeout(() => setSaved(false), 3500);
  };

  const regularCount = config.triggers.filter((t) => !t.critical && t.enabled).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white px-4 py-2 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-neutral-600 hover:text-neutral-900 text-sm font-medium">
              ← Back to Alerts
            </Link>
            <h1 className="text-xl font-semibold text-neutral-900">Policy Configuration</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToDefaultPolicy}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Reset to Default Policy
            </button>
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
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-4">
        {saved && (
          <div
            role="alert"
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-lg"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">✓</span>
            <div>
              <p className="font-semibold">Configuration saved</p>
              <p className="text-sm text-emerald-700">Triggers have been stored. The case page will use these settings at runtime.</p>
            </div>
          </div>
        )}
        <div className="rounded-lg border border-neutral-200 bg-white shadow-sm mb-4">
          <button
            type="button"
            onClick={() => setEscalationRuleOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-50/80"
            aria-expanded={escalationRuleOpen}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Escalation rule
            </h2>
            <span className="text-neutral-400 text-xs" aria-hidden>{escalationRuleOpen ? "▼" : "▶"}</span>
          </button>
          {escalationRuleOpen && (
            <div className="border-t border-neutral-200 px-4 py-3">
              <p className="text-[13px] text-neutral-700 mb-3">
                Escalate when <strong>at least N</strong> regular triggers are met, or <strong>any</strong> trigger marked as Critical is met.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2">
                  <span className="text-[13px] text-neutral-700">Min regular triggers to escalate:</span>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, config.triggers.length)}
                    value={config.minRegularTriggersToEscalate}
                    onChange={(e) => {
                      const n = parseInt(e.target.value, 10);
                      if (!Number.isNaN(n)) {
                        setConfig((c) => ({ ...c, minRegularTriggersToEscalate: n }));
                        setSaved(false);
                      }
                    }}
                    className="w-14 rounded border border-neutral-300 px-1.5 py-1 text-[13px] tabular-nums"
                  />
                </label>
                <span className="text-neutral-500 text-[13px]">
                  (e.g. &quot;{config.minRegularTriggersToEscalate} out of {regularCount}&quot; regular triggers)
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Triggers
            </h2>
            <button
              type="button"
              onClick={addNewTrigger}
              className="rounded border border-neutral-300 bg-white px-2.5 py-1 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50"
            >
              + Add New Trigger
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80">
                  <th className="py-1.5 pr-1.5 pl-3 text-[12px] font-semibold uppercase tracking-wider text-neutral-500 w-8">#</th>
                  <th className="py-1.5 pr-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">Trigger name</th>
                  <th className="py-1.5 px-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">Field</th>
                  <th className="py-1.5 px-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">Operator</th>
                  <th className="py-1.5 px-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">Threshold</th>
                  <th className="py-1.5 px-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">Unit</th>
                  <th className="py-1.5 px-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">SEV</th>
                  <th className="py-1.5 px-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">Enabled</th>
                  <th className="py-1.5 pl-1.5 text-[12px] font-semibold uppercase tracking-wider text-neutral-500"></th>
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
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-neutral-500">
          Predefined triggers have fixed name and field; threshold, severity, and enabled are editable. Custom triggers are fully editable and can be removed.
        </p>
      </main>
    </div>
  );
}
