/**
 * Rule evaluation engine for schema-driven custom rules.
 * Evaluates rules against a caseData object (keyed by registry field keys).
 */

import { getFieldByKey } from "./case-field-registry";

export type RuleCondition = {
  field: string;
  operator: string;
  value: number | string | boolean;
};

export type CustomRule = {
  id: string;
  name: string;
  enabled: boolean;
  conditions: RuleCondition[];
};

export type ConditionResult = {
  field: string;
  fieldLabel: string;
  operator: string;
  value: number | string | boolean;
  observedValue: number | string | boolean | null;
  met: boolean;
};

export type RuleEvaluationResult = {
  result: boolean;
  conditionResults: ConditionResult[];
};

function compareNumber(observed: number, op: string, threshold: number): boolean {
  switch (op) {
    case ">": return observed > threshold;
    case ">=": return observed >= threshold;
    case "<": return observed < threshold;
    case "<=": return observed <= threshold;
    case "=": return observed === threshold;
    default: return false;
  }
}

function evaluateCondition(
  condition: RuleCondition,
  caseData: Record<string, unknown>
): ConditionResult {
  const fieldDef = getFieldByKey(condition.field);
  const fieldLabel = fieldDef?.label ?? condition.field;
  const observed = caseData[condition.field];

  const result: ConditionResult = {
    field: condition.field,
    fieldLabel,
    operator: condition.operator,
    value: condition.value,
    observedValue: observed !== undefined ? (observed as number | string | boolean) : null,
    met: false,
  };

  const field = fieldDef;
  const type = field?.type ?? "number";
  const numericType = type === "number" || type === "currency" || type === "percentage" || type === "hours";

  if (observed === undefined || observed === null) {
    result.met = false;
    return result;
  }

  if (numericType) {
    const numObs = typeof observed === "number" ? observed : Number(observed);
    const numVal = typeof condition.value === "number" ? condition.value : Number(condition.value);
    result.met = !Number.isNaN(numObs) && !Number.isNaN(numVal) && compareNumber(numObs, condition.operator, numVal);
    return result;
  }

  if (type === "boolean") {
    const boolObs = observed === true || observed === "true";
    result.met = boolObs === true;
    return result;
  }

  if (type === "enum") {
    const strObs = String(observed);
    const strVal = String(condition.value);
    if (condition.operator === "equals") result.met = strObs === strVal;
    else if (condition.operator === "not_equals") result.met = strObs !== strVal;
    else if (condition.operator === "gte") {
      const options = field?.options ?? [];
      const rankObs = options.indexOf(strObs);
      const rankVal = options.indexOf(strVal);
      result.met = rankObs >= 0 && rankVal >= 0 && rankObs >= rankVal;
    } else result.met = false;
    return result;
  }

  result.met = false;
  return result;
}

/**
 * Evaluate a single rule against case data.
 * All conditions use AND logic.
 */
export function evaluateRule(
  rule: CustomRule,
  caseData: Record<string, unknown>
): RuleEvaluationResult {
  const conditionResults = rule.conditions.map((c) => evaluateCondition(c, caseData));
  const result = rule.enabled && conditionResults.length > 0 && conditionResults.every((r) => r.met);
  return { result, conditionResults };
}

/**
 * Evaluate multiple custom rules.
 */
export function evaluateCustomRules(
  rules: CustomRule[],
  caseData: Record<string, unknown>
): { rule: CustomRule; evaluation: RuleEvaluationResult }[] {
  return rules.map((rule) => ({
    rule,
    evaluation: evaluateRule(rule, caseData),
  }));
}

/** Single-trigger evaluation input (unified trigger shape). */
export type TriggerEvaluationInput = {
  fieldKey: string;
  operator: string;
  threshold: number | string | boolean;
};

export type TriggerEvaluationResult = {
  met: boolean;
  observedValue: string;
  policyRuleLabel: string;
  resultLabel: "Met" | "Not Met";
};

function formatObservedValue(val: number | string | boolean | null, fieldKey: string): string {
  if (val === null || val === undefined) return "—";
  const field = getFieldByKey(fieldKey);
  if (typeof val === "number" && Number.isFinite(val)) {
    if (field?.unit === "%" || field?.type === "percentage") return `${val}%`;
    if (field?.unit === "h" || field?.type === "hours") return `${val}h`;
    if (field?.unit === "x") return `${val}${field.unit}`;
    if (field?.type === "currency") return `$${val.toLocaleString()}`;
  }
  return String(val);
}

function formatPolicyRuleLabel(operator: string, threshold: number | string | boolean, fieldKey: string): string {
  const field = getFieldByKey(fieldKey);
  if (field?.type === "boolean") return "Condition: is true";
  if (field?.type === "enum") return operator === "gte" ? `≥ ${String(threshold)}` : `${operator} ${String(threshold)}`;
  const sym = operator === ">=" ? "≥" : operator === "<=" ? "≤" : operator;
  const suffix = (field?.unit === "%" || field?.type === "percentage") ? "%" : (field?.unit === "h" || field?.type === "hours") ? "h" : field?.unit ?? "";
  return `${sym} ${threshold}${suffix}`;
}

/**
 * Evaluate a single unified trigger against case data.
 * Used for both predefined and custom triggers; one evaluation path.
 */
export function evaluateTrigger(
  trigger: TriggerEvaluationInput,
  caseData: Record<string, unknown>
): TriggerEvaluationResult {
  const condition = { field: trigger.fieldKey, operator: trigger.operator, value: trigger.threshold };
  const cr = evaluateCondition(condition, caseData);
  const observedValue = formatObservedValue(cr.observedValue, trigger.fieldKey);
  const policyRuleLabel = formatPolicyRuleLabel(trigger.operator, trigger.threshold, trigger.fieldKey);
  return {
    met: cr.met,
    observedValue,
    policyRuleLabel,
    resultLabel: cr.met ? "Met" : "Not Met",
  };
}
