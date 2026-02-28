"use client";

import { useEffect, useState } from "react";

type RiskLevel = "High" | "Medium" | "Low";

type AlertType = "Wire" | "ACH" | "Cash Deposit" | "Crypto Transfer";
type AlertRiskLevel = "High" | "Medium" | "Low";

interface Alert {
  id: string;
  title: string;
  entityName: string;
  entityId: string;
  type: AlertType;
  date: string;
  amount: string;
  counterpartyCountry: string;
  description: string;
  riskLevel: AlertRiskLevel;
}

interface RiskSignal {
  label: string;
  severity: RiskLevel;
}

interface RiskFactor {
  name: string;
  explanation: string;
  contribution_score: number;
  bar_value: number;
}

interface KeyTransaction {
  date: string;
  amount: string;
  country: string;
  flag_reason: string;
}

interface EvidenceTraceability {
  key_transactions: KeyTransaction[];
  customer_attributes: { label: string; value: string }[];
  rule_triggers: string[];
}

interface AnalysisResult {
  case_overview: string;
  key_risk_signals: RiskSignal[];
  risk_recommendation: RiskLevel;
  confidence_score: number;
  executive_decision_summary: string;
  executive_ai_conclusion: string;
  recommended_action: string;
  risk_factors: RiskFactor[];
  risk_sensitivity_analysis: string[];
  evidence_traceability: EvidenceTraceability;
  narrative_evidence_summary: string;
  sar_draft: string;
}

const ALERTS: Alert[] = [
  {
    id: "ALRT-2024-001",
    title: "Unusual outbound wire to high-risk jurisdiction",
    entityName: "Global Freight Solutions LLC",
    entityId: "CUST-41234",
    type: "Wire",
    date: "2024-11-18",
    amount: "$47,892.37",
    counterpartyCountry: "Cyprus",
    description: "Outbound wire materially exceeds historical baseline; see Baseline section for calculated deviation. Stated purpose trade settlement; no supporting documentation on file.",
    riskLevel: "High",
  },
  {
    id: "ALRT-2024-002",
    title: "Structuring – multiple sub-10k deposits",
    entityName: "A. Ivanov Trading",
    entityId: "CUST-40891",
    type: "Cash Deposit",
    date: "2024-11-14",
    amount: "$9,847.20",
    counterpartyCountry: "United States",
    description: "Multiple cash deposits of $9,850 and similar just below CTR threshold over 48 hours; no matching business pattern. Seven deposits totaling $67,240 in 72-hour window.",
    riskLevel: "High",
  },
  {
    id: "ALRT-2024-003",
    title: "Potential PEP transaction",
    entityName: "Premier Imports Inc",
    entityId: "CUST-42156",
    type: "Wire",
    date: "2024-10-29",
    amount: "$124,750.25",
    counterpartyCountry: "United Arab Emirates",
    description: "Outbound wire to beneficiary linked to politically exposed person via World-Check match; no prior relationship or documented purpose. UAE counterparty; enhanced due diligence not completed.",
    riskLevel: "High",
  },
  {
    id: "ALRT-2024-004",
    title: "Sanctions screening hit",
    entityName: "Nordic Commodities AB",
    entityId: "CUST-43902",
    type: "Wire",
    date: "2024-12-02",
    amount: "$28,340.60",
    counterpartyCountry: "Russia",
    description: "Counterparty name and address match to OFAC designated list; transaction placed on hold pending compliance review. Russia jurisdiction; no prior screening hit for this account.",
    riskLevel: "High",
  },
  {
    id: "ALRT-2024-005",
    title: "Sanctions partial match",
    entityName: "Nordic Commodities AB",
    entityId: "CUST-43902",
    type: "Wire",
    date: "2024-12-05",
    amount: "$28,340.60",
    counterpartyCountry: "Sweden",
    description: "Partial name/address match to OFAC SDN list entity; wire amount inconsistent with account profile. Swedish entity linked to sanctioned ultimate beneficiary.",
    riskLevel: "High",
  },
  {
    id: "ALRT-2024-006",
    title: "Velocity spike in ACH transfers",
    entityName: "J. Ramirez Consulting",
    entityId: "CUST-40122",
    type: "ACH",
    date: "2024-11-22",
    amount: "$24,999.87",
    counterpartyCountry: "United States",
    description: "ACH volume 4.2x above 90-day baseline; multiple debits within 48 hours. No documented business event to support spike; possible layering or rapid movement.",
    riskLevel: "Medium",
  },
  {
    id: "ALRT-2024-007",
    title: "Trade-based over-invoicing indicator",
    entityName: "Pacific Textiles Ltd",
    entityId: "CUST-41877",
    type: "Wire",
    date: "2024-11-08",
    amount: "$186,420.50",
    counterpartyCountry: "China",
    description: "Invoice amount materially exceeds customs declaration for same shipment. Possible trade-based value movement; China counterparty; escalation for document review.",
    riskLevel: "Medium",
  },
  {
    id: "ALRT-2024-008",
    title: "Beneficiary name mismatch",
    entityName: "Metro Supply Co",
    entityId: "CUST-43341",
    type: "Wire",
    date: "2024-10-15",
    amount: "$15,724.33",
    counterpartyCountry: "British Virgin Islands",
    description: "Wire beneficiary name does not match account holder on file. First-time payment to British Virgin Islands entity; no prior relationship or explanation for discrepancy.",
    riskLevel: "Medium",
  },
  {
    id: "ALRT-2024-009",
    title: "Rapid micro-transfers to crypto wallet",
    entityName: "Tech Ventures LLC",
    entityId: "CUST-42668",
    type: "Crypto Transfer",
    date: "2025-01-06",
    amount: "$3,124.50",
    counterpartyCountry: "United States",
    description: "Twelve small transfers to same exchange within 24 hours; amounts below $5k each. Possible structuring to avoid reporting; no declared crypto activity on account.",
    riskLevel: "Medium",
  },
  {
    id: "ALRT-2024-010",
    title: "Single wire to high-risk jurisdiction (British Virgin Islands)",
    entityName: "Coastal Trading Inc",
    entityId: "CUST-40955",
    type: "Wire",
    date: "2024-09-30",
    amount: "$8,750.25",
    counterpartyCountry: "British Virgin Islands",
    description: "First-time wire to British Virgin Islands; stated purpose trade settlement. Documentation received and reviewed; within expected pattern for declared business.",
    riskLevel: "Low",
  },
  {
    id: "ALRT-2024-011",
    title: "Round-dollar ACH sequence",
    entityName: "Summit Logistics",
    entityId: "CUST-41420",
    type: "ACH",
    date: "2024-11-28",
    amount: "$5,247.00",
    counterpartyCountry: "United States",
    description: "Three ACH credits in similar amounts over one week; within normal business pattern for known payroll vendor. No velocity or jurisdiction concerns.",
    riskLevel: "Low",
  },
  {
    id: "ALRT-2024-012",
    title: "Elevated cash deposit (below threshold)",
    entityName: "Family Market Corp",
    entityId: "CUST-43716",
    type: "Cash Deposit",
    date: "2025-01-12",
    amount: "$7,183.50",
    counterpartyCountry: "United States",
    description: "Single deposit below CTR threshold; consistent with declared retail activity. No prior alerts; account in good standing.",
    riskLevel: "Low",
  },
  {
    id: "ALRT-2024-013",
    title: "New counterparty – EU wire",
    entityName: "Euro Parts GmbH",
    entityId: "CUST-42289",
    type: "Wire",
    date: "2024-12-19",
    amount: "$12,480.90",
    counterpartyCountry: "Germany",
    description: "First payment to new German supplier; documentation on file. Low-risk jurisdiction; KYC and due diligence completed at onboarding.",
    riskLevel: "Low",
  },
];

const FAKE_ANALYSIS: AnalysisResult = {
  case_overview:
    "This case was escalated due to a combination of behavioral and jurisdictional risk factors that, in aggregate, exceed the institution's threshold for enhanced due diligence. Outbound wire volume over the 90-day lookback is materially higher than the entity's historical baseline, with concentration in a short window and in two counterparties domiciled in jurisdictions subject to enhanced monitoring. Transaction timing and amounts do not align with the entity's declared trade-finance activity, and the pattern is consistent with layering or placement typologies. No positive watchlist matches were found; however, the absence of a documented legitimate business explanation for the spike, together with high-risk jurisdiction exposure and rapid fund movement, supports the escalation. Executive recommendation: enhanced due diligence and consideration of filing.",
  key_risk_signals: [
    { label: "Transaction pattern deviation from baseline (>2σ)", severity: "High" },
    { label: "Counterparty jurisdictions include high-risk countries", severity: "High" },
    { label: "Velocity of movement inconsistent with stated purpose", severity: "Medium" },
    { label: "Round-number structuring in wire sequence", severity: "Medium" },
    { label: "Limited historical relationship with beneficiaries", severity: "Low" },
  ],
  risk_recommendation: "High",
  confidence_score: 87,
  executive_decision_summary:
    "Aggregate risk factors and model confidence support escalation; no watchlist hits but behavioral pattern warrants enhanced due diligence.",
  executive_ai_conclusion:
    "This alert presents material AML risk requiring escalation.",
  recommended_action: "Escalate to Enhanced Due Diligence",
  risk_factors: [
    { name: "Transaction velocity anomaly", explanation: "Outbound wire volume exceeds 90-day baseline by >2σ; concentration in 14-day window.", contribution_score: 22, bar_value: 88 },
    { name: "High-risk jurisdiction exposure", explanation: "Counterparties in jurisdictions subject to enhanced monitoring (FATF).", contribution_score: 18, bar_value: 72 },
    { name: "Structuring behavior indicators", explanation: "Multiple sub-threshold transfers within 72-hour windows.", contribution_score: 15, bar_value: 60 },
    { name: "Round-dollar pattern detection", explanation: "Disproportionate share of round-number transactions vs. baseline.", contribution_score: 12, bar_value: 48 },
    { name: "Beneficiary relationship depth", explanation: "Limited or no prior transaction history with identified beneficiaries.", contribution_score: 10, bar_value: 40 },
    { name: "Temporal clustering", explanation: "Peak activity outside stated business hours and typical settlement cycles.", contribution_score: 10, bar_value: 40 },
  ],
  risk_sensitivity_analysis: [
    "Removing high-risk jurisdiction exposure would reduce risk by 18 points.",
    "Reducing transaction velocity to baseline would reduce risk by 22 points.",
    "Verified documentation and stated purpose would reduce uncertainty score by 10%.",
    "Establishing prior relationship with beneficiaries would reduce risk by 10 points.",
  ],
  evidence_traceability: {
    key_transactions: [
      { date: "2025-02-14", amount: "$45,000", country: "Cyprus", flag_reason: "High-risk jurisdiction" },
      { date: "2025-02-12", amount: "$32,000", country: "British Virgin Islands", flag_reason: "Round-dollar; velocity" },
      { date: "2025-02-10", amount: "$28,500", country: "Cyprus", flag_reason: "Repeat counterparty" },
    ],
    customer_attributes: [
      { label: "PEP status", value: "No" },
      { label: "High-risk country exposure", value: "Yes (2 jurisdictions)" },
      { label: "Account age", value: "18 months" },
    ],
    rule_triggers: ["AML-VEL-002", "AML-JUR-001", "AML-STRUC-003"],
  },
  narrative_evidence_summary:
    "The model identified a material increase in outbound wire volume over the 90-day lookback, with concentration in two counterparties domiciled in jurisdictions subject to enhanced monitoring. Transaction timing and amounts do not align with the entity's declared trade-finance activity.\n\nCross-referencing internal watchlists and external data did not yield positive matches; however, the behavioral pattern is consistent with layering or placement typologies. No prior SAR or enforcement history for the subject.\n\nRecommendation is based on aggregate risk factors and regulatory guidance. Human review is required before any filing decision.",
  sar_draft:
    "Filer has identified activity that may indicate [REDACTED]. Between [DATE RANGE], subject entity conducted [N] transactions totaling approximately [AMOUNT]. The pattern of activity, including [CHARACTERISTICS], is inconsistent with the entity's stated business profile. Filer recommends further investigation by appropriate authorities.",
};

/** Simulated AI analysis per alert (async). Used for auto-analyze on mount and Re-analyze. */
function getAnalysis(alert: Alert): Promise<AnalysisResult> {
  const confidence = 70 + (alert.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 23);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...FAKE_ANALYSIS,
        risk_recommendation: alert.riskLevel,
        confidence_score: Math.min(99, confidence),
      });
    }, 200 + (alert.id.charCodeAt(alert.id.length - 1) % 400));
  });
}

/* Intelligent SAR Builder — mock data */
const SAR_NARRATIVE_SECTIONS = [
  {
    title: "Subject background",
    content:
      "Subject entity [ENTITY_NAME] (ID: [ENTITY_ID]) has been a customer since [ACCOUNT_OPEN_DATE]. Stated business purpose: trade finance. No prior SAR or enforcement history.",
    tokens: ["ENTITY_NAME", "ENTITY_ID", "ACCOUNT_OPEN_DATE"],
  },
  {
    title: "Activity summary",
    content:
      "Between [DATE_RANGE], subject conducted [TX_COUNT] outbound transactions totaling [TOTAL_AMOUNT]. Activity concentrated in 14-day window; for baseline deviation see Baseline & Beneficiary Verification section.",
    tokens: ["DATE_RANGE", "TX_COUNT", "TOTAL_AMOUNT"],
  },
  {
    title: "Behavioral indicators",
    content:
      "Identified indicators: transaction velocity anomaly, high-risk jurisdiction exposure, rapid fund movement, structuring behavior indicators, limited beneficiary history. See risk driver mapping.",
    tokens: [],
  },
  {
    title: "Typology alignment",
    content:
      "Pattern consistent with FATF typology: layering / placement. FinCEN guidance: wire fraud, trade-based value movement. No determination of guilt; reporting suspicion only.",
    tokens: [],
  },
  {
    title: "Regulatory rationale",
    content:
      "Filing based on aggregate behavioral and jurisdictional risk exceeding internal threshold. No positive watchlist match; escalation supports BSA/AML program and regulatory expectations.",
    tokens: [],
  },
  {
    title: "Conclusion / recommendation",
    content:
      "Filer has identified activity that may warrant further investigation. Filer recommends that the matter be referred to appropriate authorities. No accusatory determination made.",
    tokens: [],
  },
];

const SAR_METRICS = {
  totalSuspiciousAmount: "$105,500",
  transactionCount: 12,
  topCounterparties: ["Counterparty A (Cyprus)", "Counterparty B (British Virgin Islands)", "Counterparty C (Cyprus)"],
  jurisdictionBreakdown: "Cyprus: 58% | British Virgin Islands: 42%",
  velocityVsBaseline: "3.4x above 90-day baseline",
  clusteringSummary: "3 clusters in 14 days; avg $8,792/cluster",
};

/** Business Behavior Alignment — expected (KYC) vs observed (72–90d). Match = false → ❌ */
const BUSINESS_BEHAVIOR_ROWS: { dimension: string; expected: string; observed: string; match: boolean }[] = [
  { dimension: "Cash deposit frequency", expected: "Rare / none (declared no cash)", observed: "Frequent (12 in 90d)", match: false },
  { dimension: "Average deposit size", expected: "<$2k", observed: "$8,200", match: false },
  { dimension: "Revenue spike vs declared revenue", expected: "Aligned with declared revenue", observed: "42% of declared revenue; no corresponding revenue increase", match: false },
];

const BUSINESS_BEHAVIOR_REVENUE = {
  declaredMonthlyRevenue: 19500,
  totalDepositedInWindow: 98400,
  windowMonths: 3,
};
const REVENUE_EXPOSURE_AMBER_PCT = 25;
const REVENUE_EXPOSURE_RED_PCT = 50;

/** Customer Risk Drift & Alert History — customer-level risk evolution */
const CUSTOMER_RISK_DRIFT = {
  riskRatingAtOnboarding: "Medium",
  currentInternalRiskRating: "High",
  alertsLast90Days: 3,
  alertsLast12Months: 7,
  priorSarFilings: true,
  priorSarCount: 1,
  alertFrequencyTrend: "Escalating" as "Stable" | "Increasing" | "Escalating",
};

/** Baseline & Beneficiary Verification — mock 90-day baseline for comparison */
const BASELINE_VERIFICATION = {
  avgOutboundWire90d: 18200,
  largestPriorWire90d: 28500,
  firstTimeBeneficiary: true,
  lastTransactionWithBeneficiary: null as string | null,
};
function parseAmount(amountStr: string): number {
  const n = parseFloat(amountStr.replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Baseline deviation %: ((current - baselineAvg) / baselineAvg) * 100, rounded. Used only in Baseline & Beneficiary Verification and Case Narrative Draft. */
function getBaselineDeviationPct(currentAmount: number): number {
  const avg = BASELINE_VERIFICATION.avgOutboundWire90d;
  return avg > 0 ? Math.round(((currentAmount - avg) / avg) * 100) : 0;
}

/** Business Capacity & Corridor Context — commercial plausibility */
const CORRIDOR_CONTEXT = {
  declaredMonthlyRevenue: BUSINESS_BEHAVIOR_REVENUE.declaredMonthlyRevenue,
  avgMonthlyOutbound90d: 17200,
  countriesLast12Months: ["United States", "Germany", "Sweden"] as string[],
  firstTimeCountry: true,
};

/** Industry Peer Benchmark Comparison — NAICS peer context */
const INDUSTRY_PEER_BENCHMARK = {
  avgOutboundPctOfRevenueSimilarNAICS: 42,
  avgInternationalWireFreqPeerCohort: "8.2 per month",
  peerPercentileOutboundActivity: 92,
  peerPercentileCorridorUsage: 88,
  industryDeviationSeverity: "High" as "Low" | "Moderate" | "High",
};

/** Historical Outbound Trend — last 6 months */
const HISTORICAL_OUTBOUND_MONTHS: { month: string; total: number; largestSingle: number }[] = [
  { month: "Oct 2024", total: 14200, largestSingle: 8200 },
  { month: "Nov 2024", total: 18600, largestSingle: 12100 },
  { month: "Dec 2024", total: 22400, largestSingle: 15800 },
  { month: "Jan 2025", total: 19500, largestSingle: 14200 },
  { month: "Feb 2025", total: 28100, largestSingle: 22100 },
  { month: "Mar 2025", total: 38900, largestSingle: 32100 },
];
const HISTORICAL_TREND_INDICATOR: "Stable" | "Increasing" | "Volatile" = "Increasing";

/** Behavioral Risk Composite — investigation-derived severity */
const BEHAVIORAL_RISK_COMPOSITE = {
  baselineDeviationSeverity: "High" as "Low" | "Moderate" | "High",
  velocitySeverity: "High" as "Low" | "Moderate" | "High",
  corridorNoveltySeverity: "Moderate" as "Low" | "Moderate" | "High",
  revenueStrainSeverity: "High" as "Low" | "Moderate" | "High",
  behavioralConsistencyScore: 28,
};

/** Anomaly severity from behavioral consistency score: &lt;40 = High, 40–70 = Moderate, &gt;70 = Low. Lower score = greater deviation. */
function getBehavioralAnomalySeverity(score: number): "Low" | "Moderate" | "High" {
  if (score < 40) return "High";
  if (score <= 70) return "Moderate";
  return "Low";
}

/** Source of Funds & Movement Timing — inbound/outbound and timing */
const SOURCE_OF_FUNDS = {
  largestInboundWithin7Days: 48500,
  dateOfInbound: "2024-11-15",
  dateOfOutbound: "2024-11-18",
  timeGapHours: 68,
  accountBalanceBeforeInbound: 12400,
  accountBalanceAfterOutbound: 8300,
};

/** Inbound Counterparty & Source Legitimacy — origin of largest inbound */
const INBOUND_COUNTERPARTY = {
  counterpartyName: "Nordic Trade Finance AB",
  counterpartyIndustry: "Wholesale trade" as string | null,
  counterpartyJurisdiction: "Sweden",
  firstTimeSender: true,
  priorTransactionCountWithSender: 0,
  senderInternalRiskRating: "Medium" as string | null,
  sanctionsScreeningResult: "Clear" as "Clear" | "Match",
  adverseMediaIndicator: false,
  networkOverlap: 2,
  sourceLegitimacyRisk: "Elevated" as "Low" | "Moderate" | "Elevated",
};

/** Short-Term Velocity Analysis — 7-day and 30-day burst detection */
const SHORT_TERM_VELOCITY = {
  totalOutboundLast7Days: 61200,
  historical7DayAvgOutbound: 18000,
  totalOutboundLast30Days: 98400,
  historical30DayAvg: 72000,
  spikeSeverity: "High" as "Low" | "Moderate" | "High",
};

/** Beneficiary Risk & Relationship Assessment */
const BENEFICIARY_RISK = {
  incorporationDate: "2018-03-12" as string | null,
  industryClassification: "Wholesale trade / Import-export" as string | null,
  jurisdictionRiskTier: "Elevated (FATF monitored)" as string,
  firstTimeBeneficiary: true as boolean,
  priorTransactionCount: 0 as number,
  sanctionsScreeningResult: "Clear" as "Clear" | "Match",
};

/** Network Exposure & Counterparty Linkage — institutional pattern visibility */
const NETWORK_EXPOSURE = {
  otherCustomersWithThisBeneficiary90d: 4,
  thoseAlertsEscalatedOrSarFiled: 2,
  clusterRiskIndicator: "Elevated" as "Low" | "Moderate" | "Elevated",
  corridorConcentrationScore: "12% of high-risk alerts in last 90 days",
};

/** Exposure Aggregation Summary — concentration risk */
const EXPOSURE_AGGREGATION = {
  totalLifetimeExposureBeneficiary: 47892,
  total90DayExposureBeneficiary: 47892,
  totalLifetimeExposureCountry: 124500,
  total90DayExposureCountry: 98400,
  pctOutboundVolumeToJurisdiction90d: 58,
  countryConcentrationRisk: "High" as "Low" | "Moderate" | "High",
  beneficiaryExposureConcentration: "High" as "Low" | "Moderate" | "High",
};

/** Stated Purpose & Documentation Review */
const STATED_PURPOSE_DOCS = {
  paymentReferenceText: "Invoice #INV-2024-8821 – Trade settlement" as string,
  documentationAttached: false as boolean,
  priorTradeWiresTotal: 14 as number,
  priorTradeWiresWithDocumentationCount: 12 as number,
  averageDocumentedTradeWireAmount: 11200 as number | null,
};

/** Mitigating Factors Assessment — balancing escalation decisions */
const MITIGATING_FACTORS = {
  accountTenureMonths: 18,
  dateOfLastEDD: "2024-06-15" as string | null,
  beneficialOwnershipVerified: true,
  kycReviewStatus: "Current" as "Current" | "Expired",
  historicalAlertResolutionPattern: "3 of 5 prior alerts closed as false positives",
  relationshipStabilityIndicator: "Stable" as "Stable" | "Volatile",
  mitigationStrength: "Moderate" as "Weak" | "Moderate" | "Strong",
};

/** Policy Escalation Mapping — internal triggers checklist. Rapid movement derived from time_gap_hours. */
function getPolicyEscalationTriggers(timeGapHours: number): { label: string; met: boolean }[] {
  const rapidMovement = ((): { label: string; met: boolean } => {
    if (timeGapHours <= 24) return { label: `Strong rapid movement (${timeGapHours}h)`, met: true };
    if (timeGapHours <= 72) return { label: `Moderate rapid movement (${timeGapHours}h)`, met: true };
    return { label: `Rapid movement of funds (${timeGapHours}h) – not triggered`, met: false };
  })();
  return [
    { label: ">200% deviation from baseline", met: false },
    { label: "First-time beneficiary", met: true },
    { label: "Elevated-risk jurisdiction", met: true },
    rapidMovement,
    { label: "Documentation gap", met: true },
    { label: "Corridor novelty", met: true },
  ];
}
const POLICY_ESCALATION_THRESHOLD = 3;

const SAR_QA = {
  missingElements: ["Subject occupation if individual"],
  weakJustification: 0,
  speculativeLanguageFlags: 0,
  narrativeCompletenessScore: 92,
};

const SAR_EXPORT_OPTIONS = [
  "SAR narrative",
  "Structured transaction attachment",
  "Timeline visualization",
  "Evidence appendix",
];

const SAR_TOKEN_VALUES: Record<string, string> = {
  ENTITY_NAME: "Acme Corp",
  ENTITY_ID: "8842",
  ACCOUNT_OPEN_DATE: "2024-08-14",
  DATE_RANGE: "2025-01-01 to 2025-02-14",
  TX_COUNT: "12",
  TOTAL_AMOUNT: "$105,500",
  PCT_VS_BASELINE: "—",
};

function getMergedSarNarrative(occupation?: string, boStatus?: string, tokenOverrides?: Record<string, string>): string {
  const tokens = { ...SAR_TOKEN_VALUES, ...tokenOverrides };
  const base = SAR_NARRATIVE_SECTIONS.map((s) => s.content).join("\n\n").replace(/\[(\w+)\]/g, (_, key) => tokens[key] ?? `[${key}]`);
  const appendix: string[] = [];
  if (occupation?.trim()) appendix.push(`Subject's stated occupation as ${occupation.trim()} was reviewed; no inconsistencies with activity.`);
  if (boStatus === "Verified") appendix.push("Beneficial ownership verified, no red flags.");
  if (boStatus === "Pending") appendix.push("BO review pending.");
  if (appendix.length === 0) return base;
  return base + "\n\n" + appendix.join(" ");
}

function checkComplianceGuardrails(text: string, occupation?: string): {
  accusatory: string[];
  speculative: string[];
  missing: string[];
} {
  const accusatory: string[] = [];
  const speculative: string[] = [];
  const missing: string[] = [];
  if (/\b(guilty|definitely\s+violated|clearly\s+violated|convicted|criminal\s+conduct)\b/i.test(text)) accusatory.push("Accusatory or conclusive language detected.");
  if (/\b(might\s+be|could\s+be\s+fraud|possibly\s+illegal)\b/i.test(text)) speculative.push("Speculative phrasing may weaken filing.");
  const occupationProvided = occupation != null && String(occupation).trim() !== "";
  if (SAR_QA.missingElements.some((el) => el.toLowerCase().includes("occupation")) && !occupationProvided && !/\boccupation\b/i.test(text)) missing.push("Subject occupation if individual");
  return { accusatory, speculative, missing };
}

type CaseStatus =
  | "Open"
  | "In Review"
  | "Escalated"
  | "Under Investigation"
  | "Closed"
  | "Filed"
  | "Override – Manual Review";

/** Locked escalation record after Confirm Escalation; rationale cannot be edited. */
interface EscalationRecord {
  rationale: string;
  userId: string;
  timestamp: string;
  triggersMet: number;
  triggersTotal: number;
  threshold: number;
  deviationPct: number;
  timeGapHours: number;
  triggerSnapshot: { label: string; met: boolean }[];
}

interface CaseStatusTransition {
  from: CaseStatus;
  to: CaseStatus;
  timestamp: string;
  userId: string;
}

const CASE_HEADER = {
  caseId: "CR-2025-0842",
  assignedAnalyst: "J. Chen",
  createdDate: "2025-02-14",
  slaCountdown: "2d 4h remaining",
};

type RelatedCaseOutcome = "Escalated" | "SAR Filed" | "Closed – False Positive";

interface RelatedCase {
  caseId: string;
  entity: string;
  similarityScore: number;
  outcome: RelatedCaseOutcome;
  daysAgo: number;
}

const RELATED_CASES: RelatedCase[] = [
  { caseId: "CR-2025-0781", entity: "Trade Partners Ltd (ID: 4412)", similarityScore: 94, outcome: "SAR Filed" as RelatedCaseOutcome, daysAgo: 12 },
  { caseId: "CR-2025-0692", entity: "Nordic Imports AB (ID: 5512)", similarityScore: 91, outcome: "Escalated" as RelatedCaseOutcome, daysAgo: 28 },
  { caseId: "CR-2025-0633", entity: "Global Wire Corp (ID: 2208)", similarityScore: 88, outcome: "SAR Filed" as RelatedCaseOutcome, daysAgo: 35 },
  { caseId: "CR-2025-0588", entity: "Acme Corp (ID: 8842)", similarityScore: 85, outcome: "Escalated" as RelatedCaseOutcome, daysAgo: 42 },
  { caseId: "CR-2025-0511", entity: "Pacific Holdings LLC (ID: 9901)", similarityScore: 82, outcome: "Closed – False Positive" as RelatedCaseOutcome, daysAgo: 51 },
  { caseId: "CR-2025-0492", entity: "Euro Trade GmbH (ID: 3344)", similarityScore: 79, outcome: "SAR Filed" as RelatedCaseOutcome, daysAgo: 55 },
  { caseId: "CR-2025-0440", entity: "Merchant Solutions Inc (ID: 6677)", similarityScore: 76, outcome: "Closed – False Positive" as RelatedCaseOutcome, daysAgo: 60 },
].sort((a, b) => b.similarityScore - a.similarityScore);

const CROSS_CASE_SUMMARY =
  "This behavioral signature has appeared in 14 other alerts across the institution in the last 60 days. 8 resulted in SAR filings. 3 were closed as false positives. Pattern recurrence suggests elevated institutional risk.";

const CROSS_CASE_INSIGHT =
  "AI Insight: The current alert shares a behavioral fingerprint with previously escalated cases. Similarity exceeds 82% threshold observed in confirmed SAR cases.";

interface RiskSensitivityItem {
  factor: string;
  delta: number;
  projected_score: number;
  explanation: string;
}

const RISK_SENSITIVITY: RiskSensitivityItem[] = [
  {
    factor: "Remove high-risk jurisdiction exposure",
    delta: -23,
    projected_score: 64,
    explanation:
      "If counterparties were not located in high-risk jurisdictions, overall institutional exposure would materially decrease.",
  },
  {
    factor: "Normalize transaction velocity",
    delta: -29,
    projected_score: 58,
    explanation:
      "If outbound velocity aligned with historical baseline, anomaly weight would significantly reduce.",
  },
  {
    factor: "Eliminate structuring behavior indicators",
    delta: -15,
    projected_score: 72,
    explanation:
      "Removal of structuring patterns reduces suspicion of layering behavior.",
  },
  {
    factor: "Resolve all flagged behavioral anomalies",
    delta: -46,
    projected_score: 41,
    explanation:
      "If all behavioral red flags were cleared, the alert would fall below escalation threshold.",
  },
];

const CASE_STATUS_STYLES: Record<CaseStatus, string> = {
  Open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In Review": "bg-amber-50 text-amber-700 border-amber-200",
  Escalated: "bg-red-50 text-red-700 border-red-200",
  "Under Investigation": "bg-red-50 text-red-700 border-red-200",
  Closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Filed: "bg-neutral-100 text-neutral-700 border-neutral-300",
  "Override – Manual Review": "bg-neutral-100 text-neutral-700 border-neutral-300",
};

function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const style = CASE_STATUS_STYLES[status] ?? CASE_STATUS_STYLES.Open;
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}

function RelatedCaseOutcomeBadge({ outcome }: { outcome: RelatedCaseOutcome }) {
  const styles: Record<RelatedCaseOutcome, string> = {
    Escalated: "bg-amber-50 text-amber-700 border-amber-200",
    "SAR Filed": "bg-red-50 text-red-700 border-red-200",
    "Closed – False Positive": "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${styles[outcome]}`}
    >
      {outcome}
    </span>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const styles = {
    High: "bg-red-50 text-red-700 border-red-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-all duration-200 ${styles[level]}`}
    >
      {level} risk
    </span>
  );
}

function SeverityDot({ severity }: { severity: RiskLevel }) {
  const dotClass = {
    High: "bg-red-500",
    Medium: "bg-amber-500",
    Low: "bg-emerald-500",
  };
  return (
    <span
      className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${dotClass[severity]}`}
      aria-hidden
    />
  );
}

interface TopRiskDriverItem {
  title: string;
  contribution: number;
  description: string;
  technicalDetails?: string;
}

const TOP_RISK_DRIVERS_DATA: TopRiskDriverItem[] = [
  {
    title: "Unusual Transaction Spike",
    contribution: 29,
    description:
      "Transaction volume is 3.4x higher than this entity's 90-day historical baseline.",
    technicalDetails: "Velocity metric vs. 90-day rolling mean; threshold exceeded.",
  },
  {
    title: "High-Risk Jurisdiction Exposure",
    contribution: 23,
    description:
      "Counterparties are located in jurisdictions classified as high risk by FATF.",
    technicalDetails: "FATF list match on counterparty country codes.",
  },
  {
    title: "Rapid Fund Movement",
    contribution: 18,
    description:
      "Funds exited the account within 24 hours of receipt, increasing layering risk.",
    technicalDetails: "Time-between-credit-and-debit < 24h; layering typology weight.",
  },
  {
    title: "Structuring Behavior Detected",
    contribution: 12,
    description:
      "Multiple round-dollar transactions appear designed to avoid reporting thresholds.",
    technicalDetails: "Round-amount clustering; sub-threshold aggregation in 72h window.",
  },
  {
    title: "Limited Beneficiary History",
    contribution: 7,
    description:
      "Beneficiaries have minimal prior transactional relationship with this entity.",
    technicalDetails: "Counterparty transaction count < 3 in prior 12 months.",
  },
];

const HIGH_RISK_THRESHOLD = 50;

function BehavioralConsistencyTooltip() {
  return (
    <span className="group relative ml-1 inline-flex align-middle" title="Lower scores indicate greater deviation from historical behavior.">
      <span
        tabIndex={0}
        className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-neutral-300 text-neutral-600 hover:bg-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-1"
        aria-label="Score scale and meaning"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 011.063 1.06l-.04.041c-.461.46-.544 1.174-.006 1.615a8.5 8.5 0 001.45 1.054.75.75 0 01-.982 1.15 10 10 0 01-1.687-1.265.75.75 0 01-.464-.563l-.002-.008v-.003l-.012-.01a.75.75 0 01.372-.564zm1.544-2.558a.75.75 0 01.75.75v.003a.75.75 0 01-.75.75h-.003a.75.75 0 01-.75-.75V9.25a.75.75 0 01.75-.75h.003z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-64 -translate-x-1/2 rounded-lg border border-neutral-200 bg-neutral-900 px-3 py-2 text-xs font-normal text-white shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100" role="tooltip">
        Lower scores indicate greater deviation from historical behavior. Scale: 0 = highly inconsistent, 100 = fully consistent.
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
      </span>
    </span>
  );
}

function RiskScoreTooltip({ score }: { score: number }) {
  return (
    <span className="group relative ml-1 inline-flex align-middle">
      <span
        tabIndex={0}
        className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-neutral-300 text-neutral-600 hover:bg-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-1"
        aria-label="Scores and risk thresholds"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 011.063 1.06l-.04.041c-.461.46-.544 1.174-.006 1.615a8.5 8.5 0 001.45 1.054.75.75 0 01-.982 1.15 10 10 0 01-1.687-1.265.75.75 0 01-.464-.563l-.002-.008v-.003l-.012-.01a.75.75 0 01.372-.564zm1.544-2.558a.75.75 0 01.75.75v.003a.75.75 0 01-.75.75h-.003a.75.75 0 01-.75-.75V9.25a.75.75 0 01.75-.75h.003z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-56 -translate-x-1/2 rounded-lg border border-neutral-200 bg-neutral-900 px-3 py-2 text-xs font-normal text-white shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100" role="tooltip">
        <strong>Risk score:</strong> {score} (sum of top 5 drivers)
        <br />
        <strong>Thresholds:</strong> High 50+ · Medium 25–49 · Low &lt;25
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
      </span>
    </span>
  );
}

function TopRiskDrivers() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const totalPointsFromShown = TOP_RISK_DRIVERS_DATA.reduce((sum, d) => sum + d.contribution, 0);

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Top Risk Drivers (5 of 18 model factors shown)
      </h3>
      <p className="mt-2 text-sm font-semibold text-neutral-800 flex items-center gap-0">
        Total points from shown drivers: {totalPointsFromShown}
        <RiskScoreTooltip score={totalPointsFromShown} />
      </p>
      <div className="mt-4 space-y-3">
        {TOP_RISK_DRIVERS_DATA.map((driver, i) => (
          <div
            key={i}
            className="rounded-lg border border-neutral-100 bg-white p-4 transition-shadow hover:shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h4 className="text-sm font-bold text-neutral-900">
                {driver.title}
              </h4>
              <span className="shrink-0 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-neutral-700">
                +{driver.contribution} pts
              </span>
            </div>
            <p className="mt-2 text-sm leading-snug text-neutral-600">
              {driver.description}
            </p>
            {driver.technicalDetails != null && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === i ? null : i)
                  }
                  className="text-xs font-medium text-neutral-500 underline-offset-2 hover:underline"
                >
                  {expandedIndex === i
                    ? "Hide technical details"
                    : "View technical details"}
                </button>
                {expandedIndex === i && (
                  <p className="mt-1.5 rounded border border-neutral-100 bg-neutral-50 px-2.5 py-2 font-mono text-xs text-neutral-600">
                    {driver.technicalDetails}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>("ALRT-2024-001");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzedResults, setAnalyzedResults] = useState<Record<string, AnalysisResult>>({});
  const [activeTab, setActiveTab] = useState<"Summary" | "Initial Escalation Record" | "Other">("Summary");
  const [sarTechnicalDrawerOpen, setSarTechnicalDrawerOpen] = useState(false);
  const [sarNarrativeDraft, setSarNarrativeDraft] = useState("");
  const [caseNarrativeDraft, setCaseNarrativeDraft] = useState("");
  const [occupation, setOccupation] = useState("");
  const [boStatus, setBoStatus] = useState<string>("Not Applicable");
  const [viewNarrativeStructure, setViewNarrativeStructure] = useState(false);
  const [caseStatus, setCaseStatus] = useState<CaseStatus>("Open");
  const [decisionLog, setDecisionLog] = useState<string[]>([]);
  const [decisionTaken, setDecisionTaken] = useState(false);
  const [alertStatuses, setAlertStatuses] = useState<Record<string, string>>({});
  const [recommendationFilter, setRecommendationFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideJustification, setOverrideJustification] = useState("");

  /* Final Action & Case Disposition (SAR Builder) */
  const [sarFinalized, setSarFinalized] = useState(false);
  const [sarVersion, setSarVersion] = useState(0);
  const [returnForDocCount, setReturnForDocCount] = useState(0);
  const [fileSarModalOpen, setFileSarModalOpen] = useState(false);
  const [returnForDocModalOpen, setReturnForDocModalOpen] = useState(false);
  const [returnForDocComment, setReturnForDocComment] = useState("");
  const [closeInsufficientModalOpen, setCloseInsufficientModalOpen] = useState(false);
  const [closeInsufficientReason, setCloseInsufficientReason] = useState<
    "pattern_explained" | "data_error" | "legitimate" | "other" | ""
  >("");
  const [closeInsufficientOtherText, setCloseInsufficientOtherText] = useState("");
  const [decisionAuditLog, setDecisionAuditLog] = useState<
    { user: string; timestamp: string; action: string; delta?: string }[]
  >([]);
  const [escalationModalOpen, setEscalationModalOpen] = useState(false);
  const [escalationRationaleDraft, setEscalationRationaleDraft] = useState("");
  const [escalationRecord, setEscalationRecord] = useState<EscalationRecord | null>(null);
  const [caseStatusTransitionHistory, setCaseStatusTransitionHistory] = useState<CaseStatusTransition[]>([]);

  const selectedAlert = ALERTS.find((a) => a.id === selectedAlertId);

  /* Auto-analyze all alerts on mount */
  useEffect(() => {
    let cancelled = false;
    const analyzeAll = async () => {
      const results: Record<string, AnalysisResult> = {};
      await Promise.all(
        ALERTS.map(async (alert) => {
          const a = await getAnalysis(alert);
          if (!cancelled) results[alert.id] = a;
        })
      );
      if (!cancelled) {
        setAnalyzedResults(results);
        if (selectedAlertId && results[selectedAlertId]) setAnalysis(results[selectedAlertId]);
      }
    };
    analyzeAll();
    return () => { cancelled = true; };
  }, []);

  /* Sync detail pane when selected alert or analyzed results change */
  useEffect(() => {
    if (selectedAlertId && analyzedResults[selectedAlertId]) setAnalysis(analyzedResults[selectedAlertId]);
  }, [selectedAlertId, analyzedResults]);

  /* Regenerate Case Narrative Draft when selected alert changes */
  useEffect(() => {
    if (!selectedAlert) return;
    const current = parseAmount(selectedAlert.amount);
    const avg90 = BASELINE_VERIFICATION.avgOutboundWire90d;
    const maxPrior = BASELINE_VERIFICATION.largestPriorWire90d;
    const pctVsAvg = getBaselineDeviationPct(current);
    const pctVsMax = maxPrior > 0 ? Math.round(((current - maxPrior) / maxPrior) * 100) : 0;
    const policyTriggers = getPolicyEscalationTriggers(SOURCE_OF_FUNDS.timeGapHours);
    const triggersMet = policyTriggers.filter((t) => t.met).length;
    const thresholdMet = triggersMet >= POLICY_ESCALATION_THRESHOLD;
    const narrative = [
      `Transaction summary: On ${selectedAlert.date}, an outbound ${selectedAlert.type} of ${selectedAlert.amount} was sent to ${selectedAlert.counterpartyCountry}.`,
      `Baseline comparison: The transaction represents a ${pctVsAvg > 0 ? "+" : ""}${pctVsAvg}% deviation from the 90-day average outbound ($${avg90.toLocaleString()}).`,
      `Largest prior transaction: Compared to the largest prior single outbound in 90 days ($${maxPrior.toLocaleString()}), this is ${pctVsMax > 0 ? "+" : ""}${pctVsMax}% higher.`,
      `Source of funds timing: The largest inbound within 7 days prior was $${SOURCE_OF_FUNDS.largestInboundWithin7Days.toLocaleString()} (${SOURCE_OF_FUNDS.dateOfInbound}); funds were held approximately ${SOURCE_OF_FUNDS.timeGapHours} hours before the outbound (${SOURCE_OF_FUNDS.dateOfOutbound}).`,
      `Beneficiary risk: ${BENEFICIARY_RISK.firstTimeBeneficiary ? "First-time beneficiary." : "Prior transaction history exists."} Jurisdiction risk tier: ${BENEFICIARY_RISK.jurisdictionRiskTier}. Sanctions screening: ${BENEFICIARY_RISK.sanctionsScreeningResult}.`,
      `Documentation status: ${STATED_PURPOSE_DOCS.documentationAttached ? "Supporting documentation on file." : "No supporting documentation currently on file."} Payment reference: ${STATED_PURPOSE_DOCS.paymentReferenceText}.`,
      `Policy triggers met: ${triggersMet} of ${policyTriggers.length}; threshold (${POLICY_ESCALATION_THRESHOLD}) ${thresholdMet ? "met." : "not met."}`,
    ].join(" ");
    setCaseNarrativeDraft(narrative);
  }, [selectedAlertId, selectedAlert]);

  const totalAlerts = ALERTS.length;

  /* Seed audit log and SAR draft when analysis is first available */
  useEffect(() => {
    if (!analysis) return;
    const ts = new Date().toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    setDecisionAuditLog((prev) => {
      if (prev.length > 0) return prev;
      return [
        { user: "System", timestamp: ts, action: "Draft created", delta: "Initial" },
        { user: "AI", timestamp: ts, action: "AI version updated", delta: "Narrative sections generated" },
      ];
    });
    setSarNarrativeDraft((prev) => (prev === "" ? getMergedSarNarrative(occupation, boStatus) : prev));
  }, [analysis, occupation, boStatus]);

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast((p) => ({ ...p, show: false })), 4000);
    return () => clearTimeout(t);
  }, [toast.show]);

  const runAnalysis = async () => {
    if (!selectedAlert) return;
    setIsAnalyzing(true);
    const result = await getAnalysis(selectedAlert);
    setAnalysis(result);
    setAnalyzedResults((prev) => ({ ...prev, [selectedAlert.id]: result }));
    setIsAnalyzing(false);
  };

  const downloadBlob = (content: string, filename: string, type: string = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSarNarrative = () => {
    const metricsBlock = [
      "--- AUTO-AGGREGATED METRICS ---",
      `Total suspicious amount: ${SAR_METRICS.totalSuspiciousAmount}`,
      `Transaction count: ${SAR_METRICS.transactionCount}`,
      `Top counterparties: ${SAR_METRICS.topCounterparties.join("; ")}`,
      `Jurisdiction breakdown: ${SAR_METRICS.jurisdictionBreakdown}`,
      `Velocity vs baseline: ${SAR_METRICS.velocityVsBaseline}`,
      `Clustering: ${SAR_METRICS.clusteringSummary}`,
    ].join("\n");
    const occupationBoAppendix: string[] = [];
    if (occupation.trim()) occupationBoAppendix.push(`Subject's stated occupation as ${occupation.trim()} was reviewed; no inconsistencies with activity.`);
    if (boStatus === "Verified") occupationBoAppendix.push("Beneficial ownership verified, no red flags.");
    if (boStatus === "Pending") occupationBoAppendix.push("BO review pending.");
    const appendixBlock = occupationBoAppendix.length > 0 ? "\n\n" + occupationBoAppendix.join(" ") : "";
    const content = (sarNarrativeDraft || "No narrative draft yet.") + appendixBlock + "\n\n" + metricsBlock;
    const filename = `SAR_Draft_${CASE_HEADER.caseId}.txt`;
    downloadBlob(content, filename);
    setToast({ show: true, message: `Downloaded ${filename}` });
  };

  const handleExportTransactionAttachment = () => {
    const ev = analysis?.evidence_traceability ?? FAKE_ANALYSIS.evidence_traceability;
    const rows = [["date", "amount", "country", "flag_reason"], ...ev.key_transactions.map((t) => [t.date, t.amount, t.country, t.flag_reason])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadBlob(csv, `SAR_Transactions_${CASE_HEADER.caseId}.csv`, "text/csv");
    setToast({ show: true, message: "Structured transaction attachment downloaded." });
  };

  const handleExportTimeline = () => {
    setToast({ show: true, message: "Timeline generated." });
  };

  const handleExportEvidenceAppendix = () => {
    const ev = analysis?.evidence_traceability ?? FAKE_ANALYSIS.evidence_traceability;
    const lines = [
      "EVIDENCE APPENDIX",
      `Case: ${CASE_HEADER.caseId}`,
      "",
      "Key transactions",
      ...ev.key_transactions.map((t) => `  ${t.date} | ${t.amount} | ${t.country} | ${t.flag_reason}`),
      "",
      "Customer attributes",
      ...ev.customer_attributes.map((a) => `  ${a.label}: ${a.value}`),
      "",
      "Rule triggers",
      ...ev.rule_triggers.map((r) => `  ${r}`),
    ];
    downloadBlob(lines.join("\n"), `SAR_Evidence_Appendix_${CASE_HEADER.caseId}.txt`);
    setToast({ show: true, message: "Evidence appendix downloaded." });
  };

  const handleFileSarConfirm = () => {
    const ts = formatTimestamp();
    const nextVersion = sarVersion + 1;
    setSarFinalized(true);
    setSarVersion(nextVersion);
    setCaseStatus("Filed");
    setDecisionAuditLog((prev) => [
      ...prev,
      {
        user: CASE_HEADER.assignedAnalyst,
        timestamp: ts,
        action: `SAR filed (V${nextVersion})`,
        delta: `Confidence ${analysis?.confidence_score}%; risk ${analysis?.risk_recommendation}. Snapshot captured.`,
      },
      {
        user: CASE_HEADER.assignedAnalyst,
        timestamp: ts,
        action: "SAR Filed",
        delta: "Case closed.",
      },
    ]);
    setFileSarModalOpen(false);
    setToast({ show: true, message: "SAR filed successfully (mock). Case closed." });
  };

  const handleReturnForDocSubmit = () => {
    if (!returnForDocComment.trim()) return;
    const ts = formatTimestamp();
    setDecisionAuditLog((prev) => [
      ...prev,
      {
        user: CASE_HEADER.assignedAnalyst,
        timestamp: ts,
        action: "Returned for additional documentation",
        delta: returnForDocComment.trim(),
      },
    ]);
    setReturnForDocCount((c) => c + 1);
    setReturnForDocModalOpen(false);
    setReturnForDocComment("");
    setToast({ show: true, message: "Case returned. Edits remain enabled." });
  };

  const handleCloseInsufficientSubmit = () => {
    const reasonLabel =
      closeInsufficientReason === "pattern_explained"
        ? "Pattern explained"
        : closeInsufficientReason === "data_error"
          ? "Data error"
          : closeInsufficientReason === "legitimate"
            ? "Legitimate business activity confirmed"
            : closeInsufficientReason === "other"
              ? `Other: ${closeInsufficientOtherText.trim() || "—"}`
              : "";
    if (!reasonLabel && closeInsufficientReason !== "other") return;
    if (closeInsufficientReason === "other" && !closeInsufficientOtherText.trim()) return;
    const ts = formatTimestamp();
    setDecisionAuditLog((prev) => [
      ...prev,
      {
        user: CASE_HEADER.assignedAnalyst,
        timestamp: ts,
        action: "Closed – Insufficient suspicion",
        delta: `Override vs AI. Reason: ${reasonLabel}`,
      },
    ]);
    setCloseInsufficientModalOpen(false);
    setCloseInsufficientReason("");
    setCloseInsufficientOtherText("");
    setToast({ show: true, message: "Case closed. Stored for calibration." });
  };

  const formatTimestamp = () =>
    new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const applyAlertStatus = (alertId: string, newStatus: string) => {
    const prevStatus = alertStatuses[alertId] ?? "Open";
    setAlertStatuses((prev) => ({ ...prev, [alertId]: newStatus }));
    const removesFromQueue = newStatus === "Escalated" || newStatus === "Dismissed";
  };

  const getDefaultEscalationRationale = (): string => {
    const triggers = getPolicyEscalationTriggers(SOURCE_OF_FUNDS.timeGapHours);
    const met = triggers.filter((t) => t.met).length;
    const total = triggers.length;
    const threshold = POLICY_ESCALATION_THRESHOLD;
    const deviationPct = selectedAlert
      ? getBaselineDeviationPct(parseAmount(selectedAlert.amount))
      : 0;
    const timeGap = SOURCE_OF_FUNDS.timeGapHours;
    const country = selectedAlert?.counterpartyCountry ?? "Cyprus";
    const beneficiaryLabel = "Mediterranean Trade Partners";
    return `Escalation Rationale:

This alert meets internal AML escalation criteria.

Triggers met: ${met} of ${total} (threshold: ${threshold}).

Key escalation drivers:
• First-time beneficiary (${beneficiaryLabel} – ${country}, FATF monitored).
• Elevated-risk jurisdiction exposure.
• ${deviationPct}% deviation from 90-day outbound baseline.
• Rapid movement of funds (${timeGap} hours between inbound and outbound).
• No supporting documentation for stated trade settlement.
• Corridor novelty (no prior transactions to ${country}).

The activity is inconsistent with the customer's historical behavior and declared business profile. Escalation to Investigation is required under internal AML policy.`;
  };

  const handleEscalateClick = () => {
    setEscalationRationaleDraft(getDefaultEscalationRationale());
    setEscalationModalOpen(true);
  };

  const handleEscalateConfirm = () => {
    const triggers = getPolicyEscalationTriggers(SOURCE_OF_FUNDS.timeGapHours);
    const met = triggers.filter((t) => t.met).length;
    const total = triggers.length;
    const threshold = POLICY_ESCALATION_THRESHOLD;
    const deviationPct = selectedAlert
      ? getBaselineDeviationPct(parseAmount(selectedAlert.amount))
      : 0;
    const timeGap = SOURCE_OF_FUNDS.timeGapHours;
    const ts = formatTimestamp();
    const userId = CASE_HEADER.assignedAnalyst;

    const record: EscalationRecord = {
      rationale: escalationRationaleDraft,
      userId,
      timestamp: ts,
      triggersMet: met,
      triggersTotal: total,
      threshold,
      deviationPct,
      timeGapHours: timeGap,
      triggerSnapshot: triggers.map((t) => ({ label: t.label, met: t.met })),
    };
    setEscalationRecord(record);
    setCaseStatusTransitionHistory((prev) => [
      ...prev,
      { from: caseStatus, to: "Under Investigation", timestamp: ts, userId },
    ]);
    setCaseStatus("Under Investigation");
    if (selectedAlertId) applyAlertStatus(selectedAlertId, "Escalated");
    setDecisionAuditLog((prev) => [
      ...prev,
      {
        user: userId,
        timestamp: ts,
        action: "Escalated",
        delta: `${met}/${total} policy triggers met. Case moved to Investigation.`,
      },
    ]);
    setDecisionLog((prev) => [
      ...prev,
      `Escalated by ${userId} – ${ts} – Initial Escalation Record created.`,
    ]);
    setDecisionTaken(true);
    setEscalationModalOpen(false);
    setEscalationRationaleDraft("");
    setToast({ show: true, message: "Case escalated. Status: Under Investigation. Assigned to Investigation queue." });
  };

  const handleDismiss = () => {
    const newStatus = "Dismissed";
    if (selectedAlertId) applyAlertStatus(selectedAlertId, newStatus);
    setCaseStatus("Closed");
    setDecisionLog((prev) => [
      ...prev,
      `Dismissed by ${CASE_HEADER.assignedAnalyst} – ${formatTimestamp()}`,
    ]);
    setDecisionTaken(true);
    setToast({ show: true, message: `Status updated to ${newStatus}` });
  };

  const handleOverrideSubmit = () => {
    handleDismiss();
    setOverrideModalOpen(false);
    setOverrideJustification("");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-neutral-100 font-sans text-neutral-800">
      {/* Top navigation */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
            AI Compliance Copilot
          </h1>
          <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Sandbox
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 shrink-0 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 text-xs font-medium"
            title={CASE_HEADER.assignedAnalyst}
            aria-label={`Logged in as ${CASE_HEADER.assignedAnalyst}`}
          >
            {CASE_HEADER.assignedAnalyst.split(/[\s.]+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase() || "U"}
          </div>
        </div>
      </header>

      {/* KPI summary row */}
      <div className="shrink-0 border-b border-neutral-200 bg-neutral-100 px-8 py-4">
        {(() => {
          const triggers = getPolicyEscalationTriggers(SOURCE_OF_FUNDS.timeGapHours);
          const escalationLikely = triggers.filter((t) => t.met).length >= POLICY_ESCALATION_THRESHOLD;
          const escalationRecommendedCount = escalationLikely ? totalAlerts : 0;
          const dismissalRecommendedCount = escalationLikely ? 0 : totalAlerts;
          return (
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-200">
                <p className="text-sm font-medium text-neutral-500">Total alerts</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                  {totalAlerts}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-200">
                <p className="text-sm font-medium text-neutral-500">Escalation recommended</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-red-700">
                  {escalationRecommendedCount}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-200">
                <p className="text-sm font-medium text-neutral-500">Dismissal recommended</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-700">
                  {dismissalRecommendedCount}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Main content: two columns */}
      <div className="flex min-h-0 flex-1">
        {/* Left panel */}
        <aside className="flex min-h-0 w-[380px] shrink-0 flex-col border-r border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
            Alerts
          </h2>
        </div>

        {/* Collapsible filters — collapsed by default */}
        <div className="border-b border-neutral-100 px-4 py-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-sm font-medium text-neutral-700 hover:text-neutral-900"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <span>Filters</span>
            <span className="text-neutral-500" aria-hidden>{filtersOpen ? "▲" : "▼"}</span>
          </button>
          {!filtersOpen && (
            <p className="mt-1 text-xs text-neutral-500">
              {recommendationFilter === "All" && statusFilter === "All"
                ? "All recommendations · All status"
                : `${recommendationFilter === "All" ? "All recommendations" : recommendationFilter} · ${statusFilter === "All" ? "All status" : statusFilter}`}
            </p>
          )}
          {filtersOpen && (
            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 w-full">Recommendation</span>
                {[
                  { value: "All", label: "All", activeClass: "bg-neutral-700 text-white border-neutral-700" },
                  { value: "Escalate", label: "Escalate", activeClass: "bg-amber-600 text-white border-amber-600" },
                  { value: "Dismiss", label: "Dismiss", activeClass: "bg-neutral-500 text-white border-neutral-500" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRecommendationFilter(opt.value)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      recommendationFilter === opt.value ? opt.activeClass : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 w-full">Status</span>
                {[
                  { value: "Open", label: "Open", activeClass: "bg-neutral-500 text-white border-neutral-500" },
                  { value: "Dismissed", label: "Dismissed", activeClass: "bg-neutral-600 text-white border-neutral-600" },
                  { value: "Escalated", label: "Escalated", activeClass: "bg-emerald-600 text-white border-emerald-600" },
                  { value: "All", label: "All", activeClass: "bg-neutral-700 text-white border-neutral-700" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatusFilter(opt.value)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      statusFilter === opt.value ? opt.activeClass : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <ul className="flex-1 overflow-y-auto p-3">
          {(() => {
            const triggers = getPolicyEscalationTriggers(SOURCE_OF_FUNDS.timeGapHours);
            const escalationLikely = triggers.filter((t) => t.met).length >= POLICY_ESCALATION_THRESHOLD;
            const filteredAlerts = ALERTS.filter((alert) => {
              const matchRecommendation =
                recommendationFilter === "All" ||
                (recommendationFilter === "Escalate" && escalationLikely) ||
                (recommendationFilter === "Dismiss" && !escalationLikely);
              const status = alertStatuses[alert.id] ?? "Open";
              const matchStatus = statusFilter === "All" || status === statusFilter;
              return matchRecommendation && matchStatus;
            });
            const triggersMet = triggers.filter((t) => t.met).length;
            const triggersTotal = triggers.length;
            return filteredAlerts.map((alert) => {
            const cardAnalysis = analyzedResults[alert.id];
            const isSelected = selectedAlertId === alert.id;
            const alertStatus = alertStatuses[alert.id] ?? "Open";
            const statusPillClass =
              alertStatus === "Escalated"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : alertStatus === "In Review" || alertStatus === "In Manual Review"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : alertStatus === "Dismissed" || alertStatus === "Overridden" || alertStatus === "Closed"
                    ? "bg-neutral-100 text-neutral-800 border-neutral-300"
                    : "bg-neutral-50 text-neutral-500 border-neutral-200";
            const aiAssessmentBadge = cardAnalysis ? (
              <div className="absolute top-2 right-2 text-right">
                <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${escalationLikely ? "bg-red-600 text-white" : "bg-neutral-500 text-white"}`}>
                  {escalationLikely ? "ESCALATE" : "Dismiss"}
                </span>
                <span className="block mt-1 text-[10px] text-neutral-400">Triggers: {triggersMet} / {triggersTotal}</span>
              </div>
            ) : (
              <div className="absolute top-2 right-2 text-right">
                <span className="inline-block rounded bg-neutral-400 px-2 py-1 text-xs font-medium text-white">Analyzing…</span>
              </div>
            );
            return (
              <li key={alert.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlertId(alert.id);
                    setAnalysis(cardAnalysis ?? null);
                  }}
                  className={`relative mb-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 ${
                    isSelected ? "border-blue-200 bg-blue-50/80 shadow-sm" : ""
                  }`}
                >
                  {aiAssessmentBadge}
                  <span className="block pr-24 font-medium text-neutral-900">
                    {alert.title}
                  </span>
                  <span className="mt-1 block text-sm text-neutral-500">
                    {alert.entityName} ({alert.entityId})
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                    <span>{alert.type}</span>
                    <span>·</span>
                    <span>{alert.date}</span>
                    <span>·</span>
                    <span>{alert.amount}</span>
                  </span>
                  <div className="mt-2 pt-2 border-t border-neutral-100">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">Status</span>
                    <span className={`ml-1.5 inline-flex rounded border px-1.5 py-0.5 text-xs font-medium ${statusPillClass}`}>
                      {alertStatus}
                    </span>
                  </div>
                </button>
              </li>
            );
          });
          })()}
        </ul>
      </aside>

      {/* Right panel */}
      <main className="flex min-h-0 flex-1 flex-col p-6">
        {selectedAlert ? (
          <div className="flex h-full flex-col gap-8">
            {/* Alert + Case — single merged card (compact, adequate font sizes) */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex justify-between items-start gap-3 mb-2">
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-tight text-neutral-900">{selectedAlert.title}</h3>
                  <p className="text-sm text-neutral-600 mt-0.5">{selectedAlert.entityName} ({selectedAlert.entityId})</p>
                </div>
                {(() => {
                  const triggers = getPolicyEscalationTriggers(SOURCE_OF_FUNDS.timeGapHours);
                  const triggersMet = triggers.filter((t) => t.met).length;
                  const triggersTotal = triggers.length;
                  const escalationLikely = triggersMet >= POLICY_ESCALATION_THRESHOLD;
                  return (
                    <div className="text-right shrink-0">
                      <span className={`rounded px-2.5 py-0.5 text-xs font-bold text-white ${escalationLikely ? "bg-red-600" : "bg-neutral-500"}`}>
                        {escalationLikely ? "ESCALATE" : "Dismiss"}
                      </span>
                      <span className="block mt-1 text-[10px] text-neutral-500">Triggers: {triggersMet} / {triggersTotal}</span>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-1 mb-2">
                <div><span className="text-xs text-neutral-500 uppercase tracking-wider">Type</span><span className="block text-sm font-medium text-neutral-900">{selectedAlert.type}</span></div>
                <div><span className="text-xs text-neutral-500 uppercase tracking-wider">Date</span><span className="block text-sm font-medium text-neutral-900">{selectedAlert.date}</span></div>
                <div><span className="text-xs text-neutral-500 uppercase tracking-wider">Amount</span><span className="block text-sm font-medium text-neutral-900">{selectedAlert.amount}</span></div>
                <div><span className="text-xs text-neutral-500 uppercase tracking-wider">Country</span><span className="block text-sm font-medium text-neutral-900">{selectedAlert.counterpartyCountry}</span></div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Status</span>
                  <div className="mt-0.5">
                    {(() => {
                      const s = alertStatuses[selectedAlert.id] ?? "Open";
                      const pillClass =
                        s === "Escalated" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : s === "In Review" || s === "In Manual Review" ? "bg-blue-50 text-blue-700 border-blue-200"
                        : s === "Dismissed" || s === "Overridden" || s === "Closed" ? "bg-neutral-100 text-neutral-800 border-neutral-300"
                        : "bg-neutral-50 text-neutral-500 border-neutral-200";
                      return <span className={`inline-flex rounded border px-1.5 py-0.5 text-xs font-medium ${pillClass}`}>{s}</span>;
                    })()}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Description</p>
                <p className="text-sm text-neutral-800 leading-snug mt-0.5">{selectedAlert.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200 text-sm">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-0">
                  <span><span className="text-neutral-500">Case ID</span> <span className="font-mono font-medium text-neutral-900">{CASE_HEADER.caseId}</span></span>
                  <span><span className="text-neutral-500">Assigned</span> <span className="font-medium text-neutral-900">{CASE_HEADER.assignedAnalyst}</span></span>
                  <span><span className="text-neutral-500">Created</span> <span className="text-neutral-900">{CASE_HEADER.createdDate}</span></span>
                  <span><span className="text-neutral-500">SLA</span> <span className={`font-semibold tabular-nums ${/0d|^\d+h\s/i.test(CASE_HEADER.slaCountdown) ? "text-red-600" : "text-neutral-900"}`}>{CASE_HEADER.slaCountdown}</span></span>
                </span>
              </div>

              {decisionLog.length > 0 && (
                <div className="mt-2 pt-2 border-t border-neutral-200">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Decision log</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-neutral-600">
                    {decisionLog.map((entry, i) => (
                      <li key={i}>{entry}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* AI Risk Intelligence — compact, below alert, above tabs; buttons, recommendation, UI + Policy Escalation Mapping */}
            {analysis && (
              <section
                className={`rounded-xl border border-neutral-200 border-l-4 bg-white p-3 shadow-md ${
                  analysis.risk_recommendation === "High"
                    ? "border-l-red-500"
                    : analysis.risk_recommendation === "Medium"
                      ? "border-l-amber-500"
                      : "border-l-emerald-500"
                }`}
              >
                {/* ESCALATION STATUS — within card; buttons on same row */}
                {(() => {
                  const triggers = getPolicyEscalationTriggers(SOURCE_OF_FUNDS.timeGapHours);
                  const metCount = triggers.filter((t) => t.met).length;
                  const thresholdMet = metCount >= POLICY_ESCALATION_THRESHOLD;
                  return (
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            ESCALATION STATUS
                          </h4>
                          <p className="mt-0.5 text-xs text-neutral-500">Internal triggers checklist</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleEscalateClick}
                            disabled={decisionTaken}
                            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Escalate
                          </button>
                          <button
                            type="button"
                            onClick={handleDismiss}
                            disabled={decisionTaken}
                            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm">
                        {triggers.map((t, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {t.met ? <span className="text-red-600" aria-label="Met">✓</span> : <span className="text-neutral-300" aria-label="Not met">✗</span>}
                            <span className={t.met ? "text-neutral-900" : "text-neutral-500"}>{t.label}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                        <span className="font-medium text-neutral-800">Triggers met: {metCount} of {triggers.length}</span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-600">Policy escalation threshold: <span className="font-medium text-neutral-900 tabular-nums">{POLICY_ESCALATION_THRESHOLD}</span></span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-600">Threshold met: <span className={`font-medium ${thresholdMet ? "text-red-600" : "text-neutral-700"}`}>{thresholdMet ? "Yes" : "No"}</span></span>
                      </div>
                    </div>
                  );
                })()}
              </section>
            )}

            {/* Tabs: Summary | Initial Escalation Record | Other (SAR Filing + other sections) */}
            <div className="mt-4 w-full border-b border-neutral-200">
              <div className="flex px-4">
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === "Summary" ? "border-b-2 border-blue-600 text-blue-600" : "text-neutral-600 hover:text-neutral-900"
                  }`}
                  onClick={() => setActiveTab("Summary")}
                >
                  Summary
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === "Initial Escalation Record" ? "border-b-2 border-blue-600 text-blue-600" : "text-neutral-600 hover:text-neutral-900"
                  }`}
                  onClick={() => setActiveTab("Initial Escalation Record")}
                >
                  Initial Escalation Record
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === "Other" ? "border-b-2 border-blue-600 text-blue-600" : "text-neutral-600 hover:text-neutral-900"
                  }`}
                  onClick={() => setActiveTab("Other")}
                >
                  Other
                </button>
              </div>
            </div>

            {/* Tab content — tight gap below tabs, standard padding */}
            <div className="mt-3 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
              {activeTab === "Summary" && analysis && (
                <>
                {/* Alert Summary — single-alert focus, dynamic from selectedAlert */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Alert Summary
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-neutral-700">
                    {selectedAlert
                      ? (() => {
                          const country = selectedAlert.counterpartyCountry || "high-risk jurisdiction";
                          const amount = selectedAlert.amount || "the transaction amount";
                          const rec = analysis?.recommended_action || "escalate to enhanced due diligence and consider SAR filing";
                          const riskLabel = (selectedAlert.riskLevel?.toLowerCase() ?? "high") === "high" ? "high risk" : selectedAlert.riskLevel?.toLowerCase() === "medium" ? "medium risk" : "elevated";
                          const txType = (selectedAlert.type ?? "Wire").toLowerCase();
                          return `This alert was flagged as ${riskLabel} due to an outbound ${txType} to a high-risk jurisdiction (${country}) with no prior transaction history for this beneficiary. The amount (${amount}) exceeds the entity's typical pattern, and no supporting documentation exists for the stated trade settlement purpose. This is consistent with potential layering or placement activity. No positive watchlist matches were found. Recommended action: ${rec}.`;
                        })()
                      : analysis?.case_overview}
                  </p>
                </section>

                {/* Subject & Recipient Profile — after Alert Summary */}
                <section className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Subject &amp; Recipient Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">Subject Profile</p>
                      <ul className="text-sm text-neutral-800 space-y-1.5 list-none">
                        <li><span className="text-neutral-500">Name / ID:</span> {selectedAlert.entityName} ({selectedAlert.entityId})</li>
                        <li><span className="text-neutral-500">Type:</span> Corporate (Freight &amp; Logistics)</li>
                        <li><span className="text-neutral-500">Business / Occupation:</span> Import/export trading</li>
                        <li><span className="text-neutral-500">Account Age:</span> 18 months</li>
                        <li><span className="text-neutral-500">Normal Activity:</span> Avg monthly outbound $15k–$20k, mostly wires/ACH</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">Recipient Profile</p>
                      <ul className="text-sm text-neutral-800 space-y-1.5 list-none">
                        <li><span className="text-neutral-500">Name:</span> Mediterranean Trade Partners</li>
                        <li><span className="text-neutral-500">Account:</span> CY9876543210 (Bank of Cyprus)</li>
                        <li><span className="text-neutral-500">Country:</span> Cyprus (FATF High-Risk)</li>
                        <li><span className="text-neutral-500">Relationship:</span> No prior transactions (first-time beneficiary)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Customer Risk Drift & Alert History — below Subject & Recipient Profile, above Baseline & Beneficiary Verification */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Customer Risk Drift &amp; Alert History
                  </h3>
                  <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-neutral-500">Risk rating at onboarding</dt><dd className="font-medium text-neutral-900">{CUSTOMER_RISK_DRIFT.riskRatingAtOnboarding}</dd></div>
                    <div><dt className="text-neutral-500">Current internal risk rating</dt><dd className="font-medium text-neutral-900">{CUSTOMER_RISK_DRIFT.currentInternalRiskRating}</dd></div>
                    <div><dt className="text-neutral-500">Number of alerts in last 90 days</dt><dd className="font-medium text-neutral-900 tabular-nums">{CUSTOMER_RISK_DRIFT.alertsLast90Days}</dd></div>
                    <div><dt className="text-neutral-500">Number of alerts in last 12 months</dt><dd className="font-medium text-neutral-900 tabular-nums">{CUSTOMER_RISK_DRIFT.alertsLast12Months}</dd></div>
                    <div><dt className="text-neutral-500">Prior SAR filings</dt><dd className="font-medium text-neutral-900">{CUSTOMER_RISK_DRIFT.priorSarFilings ? `Yes (${CUSTOMER_RISK_DRIFT.priorSarCount})` : "No"}</dd></div>
                    <div><dt className="text-neutral-500">Alert frequency trend indicator</dt><dd className="font-medium text-neutral-900">{CUSTOMER_RISK_DRIFT.alertFrequencyTrend}</dd></div>
                  </dl>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                    This alert occurs within a pattern of {CUSTOMER_RISK_DRIFT.alertsLast90Days} alerts in the last 90 days.
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    Customer risk posture appears {CUSTOMER_RISK_DRIFT.alertFrequencyTrend}.
                  </p>
                </section>

                {/* Baseline & Beneficiary Verification — below Customer Risk Drift */}
                {selectedAlert && (() => {
                  const currentAmount = parseAmount(selectedAlert.amount);
                  const avg90 = BASELINE_VERIFICATION.avgOutboundWire90d;
                  const maxPrior = BASELINE_VERIFICATION.largestPriorWire90d;
                  const pctVsAvg = getBaselineDeviationPct(currentAmount);
                  const pctVsMax = maxPrior > 0 ? Math.round(((currentAmount - maxPrior) / maxPrior) * 100) : 0;
                  return (
                    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Baseline &amp; Beneficiary Verification
                      </h3>
                      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                        <div><dt className="text-neutral-500">90-day average outbound wire amount</dt><dd className="font-medium text-neutral-900 tabular-nums">${avg90.toLocaleString()}</dd></div>
                        <div><dt className="text-neutral-500">Largest prior single outbound wire (90 days)</dt><dd className="font-medium text-neutral-900 tabular-nums">${maxPrior.toLocaleString()}</dd></div>
                        <div><dt className="text-neutral-500">Current wire amount</dt><dd className="font-medium text-neutral-900 tabular-nums">{selectedAlert.amount}</dd></div>
                        <div><dt className="text-neutral-500">% increase vs 90-day average</dt><dd className="font-medium text-neutral-900 tabular-nums">{pctVsAvg > 0 ? "+" : ""}{pctVsAvg}%</dd></div>
                        <div><dt className="text-neutral-500">% increase vs largest prior transaction</dt><dd className="font-medium text-neutral-900 tabular-nums">{pctVsMax > 0 ? "+" : ""}{pctVsMax}%</dd></div>
                        <div><dt className="text-neutral-500">First-time beneficiary confirmation</dt><dd className="font-medium text-neutral-900">{BASELINE_VERIFICATION.firstTimeBeneficiary ? "Yes" : "No"}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-neutral-500">Date of last transaction with this beneficiary</dt><dd className="font-medium text-neutral-900">{BASELINE_VERIFICATION.lastTransactionWithBeneficiary ?? "—"}</dd></div>
                      </dl>
                      <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                        Current wire exceeds 90-day average by {pctVsAvg > 0 ? "+" : ""}{pctVsAvg}% and prior single-transaction maximum by {pctVsMax > 0 ? "+" : ""}{pctVsMax}%.
                      </p>
                    </section>
                  );
                })()}

                {/* Business Capacity & Corridor Context — below Subject & Recipient Profile. Revenue % from same-period comparisons only. */}
                {selectedAlert && (() => {
                  const declaredMonthlyRevenue = BUSINESS_BEHAVIOR_REVENUE.declaredMonthlyRevenue;
                  const currentWireAmount = parseAmount(selectedAlert.amount);
                  const outbound90d = BUSINESS_BEHAVIOR_REVENUE.totalDepositedInWindow;
                  const declared90dRevenue = declaredMonthlyRevenue * BUSINESS_BEHAVIOR_REVENUE.windowMonths;
                  const wirePctOfMonthlyRevenue = declaredMonthlyRevenue > 0 ? Math.round((currentWireAmount / declaredMonthlyRevenue) * 100) : 0;
                  const outbound90dPctOfDeclared90d = declared90dRevenue > 0 ? Math.round((outbound90d / declared90dRevenue) * 100) : 0;
                  const firstTimeCountry = CORRIDOR_CONTEXT.firstTimeCountry;
                  return (
                    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Business Capacity &amp; Corridor Context
                      </h3>
                      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                        <div><dt className="text-neutral-500">Declared monthly revenue</dt><dd className="font-medium text-neutral-900 tabular-nums">${declaredMonthlyRevenue.toLocaleString()}</dd></div>
                        <div><dt className="text-neutral-500">Current wire amount</dt><dd className="font-medium text-neutral-900 tabular-nums">{selectedAlert.amount}</dd></div>
                        <div><dt className="text-neutral-500">Wire vs monthly revenue</dt><dd className="font-medium text-neutral-900 tabular-nums">{wirePctOfMonthlyRevenue}%</dd></div>
                        <div><dt className="text-neutral-500">90-day outbound total</dt><dd className="font-medium text-neutral-900 tabular-nums">${outbound90d.toLocaleString()}</dd></div>
                        <div><dt className="text-neutral-500">90-day declared revenue (3 × monthly)</dt><dd className="font-medium text-neutral-900 tabular-nums">${declared90dRevenue.toLocaleString()}</dd></div>
                        <div><dt className="text-neutral-500">90-day outbound vs 90-day declared revenue</dt><dd className="font-medium text-neutral-900 tabular-nums">{outbound90dPctOfDeclared90d}%</dd></div>
                        <div><dt className="text-neutral-500">Indicator: First-time country</dt><dd className="font-medium text-neutral-900">{firstTimeCountry ? "Yes" : "No"}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-neutral-500">Countries used in last 12 months</dt><dd className="font-medium text-neutral-900">{CORRIDOR_CONTEXT.countriesLast12Months.length ? CORRIDOR_CONTEXT.countriesLast12Months.join(", ") : "—"}</dd></div>
                      </dl>
                      <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                        Wire vs monthly revenue: {wirePctOfMonthlyRevenue}%. 90-day outbound vs 90-day declared revenue: {outbound90dPctOfDeclared90d}%.
                      </p>
                      <p className="mt-1 text-sm text-neutral-700">
                        This destination has{firstTimeCountry ? " not" : ""} been used previously.
                      </p>
                    </section>
                  );
                })()}

                {/* Industry Peer Benchmark Comparison — below Business Capacity & Corridor Context */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Industry Peer Benchmark Comparison
                  </h3>
                  <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-neutral-500">Average outbound as % of revenue for similar NAICS industry</dt><dd className="font-medium text-neutral-900 tabular-nums">{INDUSTRY_PEER_BENCHMARK.avgOutboundPctOfRevenueSimilarNAICS}%</dd></div>
                    <div><dt className="text-neutral-500">Average international wire frequency for peer cohort</dt><dd className="font-medium text-neutral-900">{INDUSTRY_PEER_BENCHMARK.avgInternationalWireFreqPeerCohort}</dd></div>
                    <div><dt className="text-neutral-500">Peer percentile ranking for this customer&apos;s outbound activity</dt><dd className="font-medium text-neutral-900 tabular-nums">{INDUSTRY_PEER_BENCHMARK.peerPercentileOutboundActivity}{["th", "st", "nd", "rd"][((INDUSTRY_PEER_BENCHMARK.peerPercentileOutboundActivity % 100) - 20) % 10] ?? "th"}</dd></div>
                    <div><dt className="text-neutral-500">Peer percentile ranking for corridor usage</dt><dd className="font-medium text-neutral-900 tabular-nums">{INDUSTRY_PEER_BENCHMARK.peerPercentileCorridorUsage}{["th", "st", "nd", "rd"][((INDUSTRY_PEER_BENCHMARK.peerPercentileCorridorUsage % 100) - 20) % 10] ?? "th"}</dd></div>
                  </dl>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                    Customer outbound activity ranks in the {INDUSTRY_PEER_BENCHMARK.peerPercentileOutboundActivity}{(() => { const n = INDUSTRY_PEER_BENCHMARK.peerPercentileOutboundActivity; const ord = ["th", "st", "nd", "rd"][((n % 100) - 20) % 10] ?? "th"; return ord; })()} percentile compared to industry peers.
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    Industry deviation severity: {INDUSTRY_PEER_BENCHMARK.industryDeviationSeverity}.
                  </p>
                </section>

                {/* Historical Outbound Trend — below Business Capacity & Corridor Context */}
                {selectedAlert && (() => {
                  const currentWire = parseAmount(selectedAlert.amount);
                  const months = HISTORICAL_OUTBOUND_MONTHS;
                  const historicalMax = Math.max(...months.map((m) => m.largestSingle));
                  const monthsWhereCurrentIsHighest = months.filter((m) => currentWire > m.largestSingle).length;
                  const currentIsHighestInWindow = currentWire > historicalMax;
                  const xMonths = currentIsHighestInWindow ? months.length : monthsWhereCurrentIsHighest;
                  return (
                    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Historical Outbound Trend
                      </h3>
                      <div className="mt-3 overflow-hidden rounded border border-neutral-200">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50">
                              <th className="px-3 py-2 text-left font-medium text-neutral-600">Month</th>
                              <th className="px-3 py-2 text-right font-medium text-neutral-600">Monthly total</th>
                              <th className="px-3 py-2 text-right font-medium text-neutral-600">Largest single</th>
                            </tr>
                          </thead>
                          <tbody>
                            {months.map((m, i) => (
                              <tr key={i} className="border-b border-neutral-100 last:border-0">
                                <td className="px-3 py-2 text-neutral-700">{m.month}</td>
                                <td className="px-3 py-2 text-right font-medium tabular-nums text-neutral-800">${m.total.toLocaleString()}</td>
                                <td className="px-3 py-2 text-right font-medium tabular-nums text-neutral-800">${m.largestSingle.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-neutral-600">Trend:</span>
                        <span className="font-medium text-neutral-900">{HISTORICAL_TREND_INDICATOR}</span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-600">Current wire:</span>
                        <span className="font-medium tabular-nums text-neutral-900">{selectedAlert.amount}</span>
                        <span className="text-neutral-600">vs historical max (6mo):</span>
                        <span className="font-medium tabular-nums text-neutral-900">${historicalMax.toLocaleString()}</span>
                        {currentWire > historicalMax && <span className="text-red-600 font-medium">(above max)</span>}
                      </div>
                      <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                        Current transaction is the highest outbound in {xMonths} month{xMonths === 1 ? "" : "s"}.
                      </p>
                    </section>
                  );
                })()}

                {/* Behavioral Risk Composite — below Historical Outbound Trend (6m) */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Behavioral Risk Composite
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-500">
                    Behavioral consistency scale: 0 = highly inconsistent, 100 = fully consistent.
                  </p>
                  <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-neutral-500">Baseline deviation severity</dt><dd className="font-medium text-neutral-900">{BEHAVIORAL_RISK_COMPOSITE.baselineDeviationSeverity}</dd></div>
                    <div><dt className="text-neutral-500">Velocity severity</dt><dd className="font-medium text-neutral-900">{BEHAVIORAL_RISK_COMPOSITE.velocitySeverity}</dd></div>
                    <div><dt className="text-neutral-500">Corridor novelty severity</dt><dd className="font-medium text-neutral-900">{BEHAVIORAL_RISK_COMPOSITE.corridorNoveltySeverity}</dd></div>
                    <div><dt className="text-neutral-500">Revenue strain severity</dt><dd className="font-medium text-neutral-900">{BEHAVIORAL_RISK_COMPOSITE.revenueStrainSeverity}</dd></div>
                    <div>
                      <dt className="text-neutral-500">Behavioral consistency score (0–100)</dt>
                      <dd className="font-medium text-neutral-900 tabular-nums inline-flex items-center">
                        {BEHAVIORAL_RISK_COMPOSITE.behavioralConsistencyScore}
                        <BehavioralConsistencyTooltip />
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-sm font-medium text-neutral-800">
                    Overall behavioral anomaly level: {getBehavioralAnomalySeverity(BEHAVIORAL_RISK_COMPOSITE.behavioralConsistencyScore)}. Lower scores indicate greater deviation from historical behavior.
                  </p>
                </section>

                {/* Source of Funds & Movement Timing — below Historical Outbound Trend */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Source of Funds &amp; Movement Timing
                  </h3>
                  <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-neutral-500">Largest inbound within 7 days prior to wire</dt><dd className="font-medium text-neutral-900 tabular-nums">${SOURCE_OF_FUNDS.largestInboundWithin7Days.toLocaleString()}</dd></div>
                    <div><dt className="text-neutral-500">Date of inbound</dt><dd className="font-medium text-neutral-900">{SOURCE_OF_FUNDS.dateOfInbound}</dd></div>
                    <div><dt className="text-neutral-500">Date of outbound</dt><dd className="font-medium text-neutral-900">{SOURCE_OF_FUNDS.dateOfOutbound}</dd></div>
                    <div><dt className="text-neutral-500">Time gap between inbound and outbound (hours)</dt><dd className="font-medium text-neutral-900 tabular-nums">{SOURCE_OF_FUNDS.timeGapHours}h</dd></div>
                    <div><dt className="text-neutral-500">Account balance before inbound</dt><dd className="font-medium text-neutral-900 tabular-nums">${SOURCE_OF_FUNDS.accountBalanceBeforeInbound.toLocaleString()}</dd></div>
                    <div><dt className="text-neutral-500">Account balance after outbound</dt><dd className="font-medium text-neutral-900 tabular-nums">${SOURCE_OF_FUNDS.accountBalanceAfterOutbound.toLocaleString()}</dd></div>
                  </dl>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                    Funds were held for {SOURCE_OF_FUNDS.timeGapHours} hours before being wired out.
                  </p>
                </section>

                {/* Inbound Counterparty & Source Legitimacy — below Source of Funds, above Short-Term Velocity */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Inbound Counterparty &amp; Source Legitimacy
                  </h3>
                  <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-neutral-500">Inbound counterparty name (largest inbound funding this transaction)</dt><dd className="font-medium text-neutral-900">{INBOUND_COUNTERPARTY.counterpartyName}</dd></div>
                    <div><dt className="text-neutral-500">Counterparty industry</dt><dd className="font-medium text-neutral-900">{INBOUND_COUNTERPARTY.counterpartyIndustry ?? "—"}</dd></div>
                    <div><dt className="text-neutral-500">Counterparty jurisdiction</dt><dd className="font-medium text-neutral-900">{INBOUND_COUNTERPARTY.counterpartyJurisdiction}</dd></div>
                    <div><dt className="text-neutral-500">First-time sender indicator</dt><dd className="font-medium text-neutral-900">{INBOUND_COUNTERPARTY.firstTimeSender ? "Yes" : "No"}</dd></div>
                    <div><dt className="text-neutral-500">Prior transaction count with this sender</dt><dd className="font-medium text-neutral-900 tabular-nums">{INBOUND_COUNTERPARTY.priorTransactionCountWithSender}</dd></div>
                    <div><dt className="text-neutral-500">Sender internal risk rating</dt><dd className="font-medium text-neutral-900">{INBOUND_COUNTERPARTY.senderInternalRiskRating ?? "—"}</dd></div>
                    <div><dt className="text-neutral-500">Sanctions screening result for sender</dt><dd className="font-medium text-neutral-900">{INBOUND_COUNTERPARTY.sanctionsScreeningResult}</dd></div>
                    <div><dt className="text-neutral-500">Adverse media indicator</dt><dd className="font-medium text-neutral-900">{INBOUND_COUNTERPARTY.adverseMediaIndicator ? "Yes" : "No"}</dd></div>
                    <div><dt className="text-neutral-500">Network overlap (other customers transacting with this sender)</dt><dd className="font-medium text-neutral-900 tabular-nums">{INBOUND_COUNTERPARTY.networkOverlap}</dd></div>
                  </dl>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                    Inbound funds originated from a {INBOUND_COUNTERPARTY.firstTimeSender ? "new" : "existing"} counterparty.
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    Source legitimacy risk: {INBOUND_COUNTERPARTY.sourceLegitimacyRisk}.
                  </p>
                </section>

                {/* Short-Term Velocity Analysis — below Source of Funds & Movement Timing, above Beneficiary Risk */}
                {(() => {
                  const v = SHORT_TERM_VELOCITY;
                  const spikeMultiple7d = v.historical7DayAvgOutbound > 0 ? (v.totalOutboundLast7Days / v.historical7DayAvgOutbound) : 0;
                  const anomalyDetected = spikeMultiple7d >= 1.5;
                  return (
                    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Short-Term Velocity Analysis
                      </h3>
                      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                        <div><dt className="text-neutral-500">Total outbound in last 7 days</dt><dd className="font-medium text-neutral-900 tabular-nums">${v.totalOutboundLast7Days.toLocaleString()}</dd></div>
                        <div><dt className="text-neutral-500">Historical 7-day average outbound</dt><dd className="font-medium text-neutral-900 tabular-nums">${v.historical7DayAvgOutbound.toLocaleString()}</dd></div>
                        <div><dt className="text-neutral-500">Spike multiple (7d)</dt><dd className="font-medium text-neutral-900 tabular-nums">{spikeMultiple7d.toFixed(1)}x normal</dd></div>
                        <div><dt className="text-neutral-500">Total outbound in last 30 days</dt><dd className="font-medium text-neutral-900 tabular-nums">${v.totalOutboundLast30Days.toLocaleString()}</dd></div>
                        <div><dt className="text-neutral-500">Historical 30-day average</dt><dd className="font-medium text-neutral-900 tabular-nums">${v.historical30DayAvg.toLocaleString()}</dd></div>
                        <div><dt className="text-neutral-500">Short-term spike severity indicator</dt><dd className="font-medium text-neutral-900">{v.spikeSeverity}</dd></div>
                      </dl>
                      <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                        7-day outbound volume is {spikeMultiple7d.toFixed(1)} times historical norm.
                      </p>
                      <p className="mt-1 text-sm text-neutral-700">
                        Short-term velocity anomaly detected: {anomalyDetected ? "Yes" : "No"}.
                      </p>
                    </section>
                  );
                })()}

                {/* Beneficiary Risk & Relationship Assessment — below Source of Funds & Movement Timing */}
                {(() => {
                  const b = BENEFICIARY_RISK;
                  const isNewAndElevated = b.firstTimeBeneficiary && b.priorTransactionCount === 0;
                  const summaryText = isNewAndElevated
                    ? "Beneficiary relationship is new and located in an elevated-risk jurisdiction."
                    : "Beneficiary has prior transaction history and established relationship.";
                  return (
                    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Beneficiary Risk &amp; Relationship Assessment
                      </h3>
                      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                        <div><dt className="text-neutral-500">Beneficiary entity age (incorporation date)</dt><dd className="font-medium text-neutral-900">{b.incorporationDate ?? "—"}</dd></div>
                        <div><dt className="text-neutral-500">Industry classification</dt><dd className="font-medium text-neutral-900">{b.industryClassification ?? "—"}</dd></div>
                        <div><dt className="text-neutral-500">Jurisdiction risk tier</dt><dd className="font-medium text-neutral-900">{b.jurisdictionRiskTier}</dd></div>
                        <div><dt className="text-neutral-500">First-time beneficiary indicator</dt><dd className="font-medium text-neutral-900">{b.firstTimeBeneficiary ? "Yes" : "No"}</dd></div>
                        <div><dt className="text-neutral-500">Prior transaction count with this beneficiary</dt><dd className="font-medium text-neutral-900 tabular-nums">{b.priorTransactionCount}</dd></div>
                        <div><dt className="text-neutral-500">Sanctions screening result</dt><dd className="font-medium text-neutral-900">{b.sanctionsScreeningResult}</dd></div>
                      </dl>
                      <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                        {summaryText}
                      </p>
                    </section>
                  );
                })()}

                {/* Network Exposure & Counterparty Linkage — below Beneficiary Risk, above Stated Purpose & Documentation Review */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Network Exposure &amp; Counterparty Linkage
                  </h3>
                  <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-neutral-500">Number of other customers who transacted with this beneficiary in last 90 days</dt><dd className="font-medium text-neutral-900 tabular-nums">{NETWORK_EXPOSURE.otherCustomersWithThisBeneficiary90d}</dd></div>
                    <div><dt className="text-neutral-500">Number of those alerts escalated or SAR filed</dt><dd className="font-medium text-neutral-900 tabular-nums">{NETWORK_EXPOSURE.thoseAlertsEscalatedOrSarFiled}</dd></div>
                    <div><dt className="text-neutral-500">Cluster risk indicator</dt><dd className="font-medium text-neutral-900">{NETWORK_EXPOSURE.clusterRiskIndicator}</dd></div>
                    <div><dt className="text-neutral-500">Corridor concentration score</dt><dd className="font-medium text-neutral-900">{NETWORK_EXPOSURE.corridorConcentrationScore}</dd></div>
                  </dl>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                    This beneficiary appears in {NETWORK_EXPOSURE.otherCustomersWithThisBeneficiary90d} other alerts institution-wide.
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    Cluster risk: {NETWORK_EXPOSURE.clusterRiskIndicator}.
                  </p>
                </section>

                {/* Exposure Aggregation Summary — below Network Exposure & Counterparty Linkage */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Exposure Aggregation Summary
                  </h3>
                  <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-neutral-500">Total lifetime exposure to this beneficiary</dt><dd className="font-medium text-neutral-900 tabular-nums">${EXPOSURE_AGGREGATION.totalLifetimeExposureBeneficiary.toLocaleString()}</dd></div>
                    <div><dt className="text-neutral-500">Total 90-day exposure to this beneficiary</dt><dd className="font-medium text-neutral-900 tabular-nums">${EXPOSURE_AGGREGATION.total90DayExposureBeneficiary.toLocaleString()}</dd></div>
                    <div><dt className="text-neutral-500">Total lifetime exposure to this country</dt><dd className="font-medium text-neutral-900 tabular-nums">${EXPOSURE_AGGREGATION.totalLifetimeExposureCountry.toLocaleString()}</dd></div>
                    <div><dt className="text-neutral-500">Total 90-day exposure to this country</dt><dd className="font-medium text-neutral-900 tabular-nums">${EXPOSURE_AGGREGATION.total90DayExposureCountry.toLocaleString()}</dd></div>
                    <div><dt className="text-neutral-500">% of outbound volume directed to this jurisdiction (90d)</dt><dd className="font-medium text-neutral-900 tabular-nums">{EXPOSURE_AGGREGATION.pctOutboundVolumeToJurisdiction90d}%</dd></div>
                  </dl>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                    Country concentration risk: {EXPOSURE_AGGREGATION.countryConcentrationRisk}.
                  </p>
                  <p className="mt-1 text-sm text-neutral-700">
                    Beneficiary exposure concentration: {EXPOSURE_AGGREGATION.beneficiaryExposureConcentration}.
                  </p>
                </section>

                {/* Stated Purpose & Documentation Review — below Beneficiary Risk & Relationship Assessment */}
                {(() => {
                  const d = STATED_PURPOSE_DOCS;
                  const priorDocPct = d.priorTradeWiresTotal > 0 ? Math.round((d.priorTradeWiresWithDocumentationCount / d.priorTradeWiresTotal) * 100) : 0;
                  const documentationGapPresent = !d.documentationAttached;
                  return (
                    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Stated Purpose &amp; Documentation Review
                      </h3>
                      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                        <div className="sm:col-span-2"><dt className="text-neutral-500">Payment reference text</dt><dd className="font-medium text-neutral-900">{d.paymentReferenceText}</dd></div>
                        <div><dt className="text-neutral-500">Documentation attached</dt><dd className="font-medium text-neutral-900">{d.documentationAttached ? "Yes" : "No"}</dd></div>
                        <div><dt className="text-neutral-500">Prior trade wires with documentation count</dt><dd className="font-medium text-neutral-900 tabular-nums">{d.priorTradeWiresWithDocumentationCount} of {d.priorTradeWiresTotal}</dd></div>
                        <div><dt className="text-neutral-500">Average documented trade wire amount</dt><dd className="font-medium text-neutral-900 tabular-nums">{d.averageDocumentedTradeWireAmount != null ? `$${d.averageDocumentedTradeWireAmount.toLocaleString()}` : "—"}</dd></div>
                        <div><dt className="text-neutral-500">Documentation gap</dt><dd className="font-medium text-neutral-900">{documentationGapPresent ? "Present" : "Not Present"}</dd></div>
                      </dl>
                      <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-700">
                        Prior trade wires included documentation in {priorDocPct}% of cases.
                      </p>
                      <p className="mt-1 text-sm text-neutral-700">
                        {d.documentationAttached ? "Supporting documentation on file." : "No supporting documentation currently on file."}
                      </p>
                    </section>
                  );
                })()}

                {/* Mitigating Factors Assessment */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Mitigating Factors Assessment
                  </h3>
                  <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-neutral-500">Account tenure (months with institution)</dt><dd className="font-medium text-neutral-900 tabular-nums">{MITIGATING_FACTORS.accountTenureMonths}</dd></div>
                    <div><dt className="text-neutral-500">Date of last Enhanced Due Diligence (EDD)</dt><dd className="font-medium text-neutral-900">{MITIGATING_FACTORS.dateOfLastEDD ?? "—"}</dd></div>
                    <div><dt className="text-neutral-500">Beneficial ownership verified</dt><dd className="font-medium text-neutral-900">{MITIGATING_FACTORS.beneficialOwnershipVerified ? "Yes" : "No"}</dd></div>
                    <div><dt className="text-neutral-500">KYC review status</dt><dd className="font-medium text-neutral-900">{MITIGATING_FACTORS.kycReviewStatus}</dd></div>
                    <div className="sm:col-span-2"><dt className="text-neutral-500">Historical alert resolution pattern</dt><dd className="font-medium text-neutral-900">{MITIGATING_FACTORS.historicalAlertResolutionPattern}</dd></div>
                    <div><dt className="text-neutral-500">Relationship stability indicator</dt><dd className="font-medium text-neutral-900">{MITIGATING_FACTORS.relationshipStabilityIndicator}</dd></div>
                  </dl>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-sm font-medium text-neutral-800">
                    Mitigation strength: {MITIGATING_FACTORS.mitigationStrength}.
                  </p>
                </section>
                </>
              )}

              {activeTab === "Other" && analysis && (
                <>
                {/* Business Behavior Alignment — expected (KYC) vs observed (72–90d) */}
                {(() => {
                  const declared90dRevenue = BUSINESS_BEHAVIOR_REVENUE.declaredMonthlyRevenue * BUSINESS_BEHAVIOR_REVENUE.windowMonths;
                  const revenuePct90d = declared90dRevenue > 0 ? (BUSINESS_BEHAVIOR_REVENUE.totalDepositedInWindow / declared90dRevenue) * 100 : 0;
                  const mismatchCount = BUSINESS_BEHAVIOR_ROWS.filter((r) => !r.match).length;
                  const revenueWarning = revenuePct90d >= REVENUE_EXPOSURE_RED_PCT ? "red" : revenuePct90d >= REVENUE_EXPOSURE_AMBER_PCT ? "amber" : null;
                  return (
                    <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
                      <h3 className="border-b border-neutral-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Business Behavior Alignment
                      </h3>
                      <p className="px-4 pt-3 text-xs text-neutral-500">
                        Expected vs Observed (last 72–90 days)
                      </p>
                      <div className="p-4">
                        <div className="overflow-hidden rounded border border-neutral-200">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-neutral-200 bg-neutral-50">
                                <th className="px-3 py-2 text-left font-medium text-neutral-600">Dimension</th>
                                <th className="px-3 py-2 text-left font-medium text-neutral-600">Expected (from KYC/onboarding)</th>
                                <th className="px-3 py-2 text-left font-medium text-neutral-600">Observed (last 72–90 days)</th>
                                <th className="px-3 py-2 text-center font-medium text-neutral-600 w-16">Match</th>
                              </tr>
                            </thead>
                            <tbody>
                              {BUSINESS_BEHAVIOR_ROWS.map((row, i) => (
                                <tr key={i} className="border-b border-neutral-100 last:border-0">
                                  <td className="px-3 py-2 font-medium text-neutral-700">{row.dimension}</td>
                                  <td className="px-3 py-2 text-neutral-600">{row.expected}</td>
                                  <td className="px-3 py-2 text-neutral-700">{row.observed}</td>
                                  <td className="px-3 py-2 text-center">
                                    {row.match ? <span className="text-emerald-600" aria-label="Match">✓</span> : <span className="text-red-600" aria-label="Mismatch">✗</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">Revenue exposure</h4>
                          {(() => {
                            const expected90 = BUSINESS_BEHAVIOR_REVENUE.declaredMonthlyRevenue * BUSINESS_BEHAVIOR_REVENUE.windowMonths;
                            const observed90 = BUSINESS_BEHAVIOR_REVENUE.totalDepositedInWindow;
                            const diff = observed90 - expected90;
                            return (
                              <dl className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-[auto_1fr] sm:gap-x-4">
                                <dt className="text-neutral-600">Expected 90-day revenue:</dt>
                                <dd className="font-medium text-neutral-800 tabular-nums">${expected90.toLocaleString()}</dd>
                                <dt className="text-neutral-600">Observed 90-day deposits:</dt>
                                <dd className="font-medium text-neutral-800 tabular-nums">${observed90.toLocaleString()}</dd>
                                <dt className="text-neutral-600">Difference:</dt>
                                <dd className="font-medium tabular-nums">{diff >= 0 ? "+" : ""}${Math.abs(diff).toLocaleString()}</dd>
                                <dt className="text-neutral-600">Status:</dt>
                                <dd className="font-medium text-neutral-800">{diff > 0 ? "Exceeds expected revenue" : diff < 0 ? "Below expected revenue" : "In line with expected revenue"}</dd>
                              </dl>
                            );
                          })()}
                          <p className="mt-2 text-xs text-neutral-600">
                            {revenueWarning === "red" ? (
                              <span className="text-red-600 font-medium">{revenuePct90d.toFixed(0)}% of declared 90-day revenue (high exposure)</span>
                            ) : revenueWarning === "amber" ? (
                              <span className="text-neutral-700">{revenuePct90d.toFixed(0)}% of declared 90-day revenue (elevated exposure)</span>
                            ) : (
                              <>{revenuePct90d.toFixed(0)}% of declared 90-day revenue</>
                            )}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-neutral-200">
                          <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">Alignment Conclusion</h4>
                          <ul className="text-sm text-neutral-700 space-y-1 list-disc list-inside">
                            <li>{mismatchCount} of {BUSINESS_BEHAVIOR_ROWS.length} behavioral dimensions inconsistent with declared business profile.</li>
                            <li>Deposits materially exceed expected frequency and size.</li>
                            <li>90-day deposits represent {revenuePct90d.toFixed(0)}% of declared 90-day revenue.</li>
                          </ul>
                          <p className="mt-2 text-sm font-bold text-neutral-900">
                            Conclusion: Behavior inconsistent with KYC profile. Escalation criteria met.
                          </p>
                        </div>
                      </div>
                    </section>
                  );
                })()}

                {/* Risk Sensitivity Analysis — simulated impact */}
                <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Risk Sensitivity Analysis
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    Simulated impact on risk score if specific drivers were
                    mitigated.
                  </p>
                  <div className="mt-4 space-y-4">
                    {RISK_SENSITIVITY.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-neutral-100 p-4 transition-shadow duration-200 hover:shadow-md"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-sm font-medium text-neutral-900">
                            {item.factor}
                          </span>
                          <span className="text-sm font-semibold tabular-nums text-red-600">
                            {item.delta} points
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-neutral-500">
                            Projected score:
                          </span>
                          <span className="text-sm font-bold tabular-nums text-neutral-900">
                            {item.projected_score}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{
                              width: `${item.projected_score}%`,
                            }}
                          />
                        </div>
                        <p className="mt-2 text-xs leading-snug text-neutral-600">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Decision Defensibility */}
                <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Decision defensibility
                  </h3>

                  <div className="mt-5 space-y-6">
                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Key assumptions behind escalation
                      </h4>
                      <ul className="mt-3 space-y-2">
                        <li className="text-sm text-neutral-700">
                          Transaction velocity materially exceeds historical
                          baseline
                        </li>
                        <li className="text-sm text-neutral-700">
                          Counterparty jurisdictions are correctly classified as
                          high-risk
                        </li>
                        <li className="text-sm text-neutral-700">
                          No documented legitimate business explanation
                          currently supports the pattern
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Material data gaps affecting confidence
                      </h4>
                      <ul className="mt-3 space-y-2">
                        <li className="text-sm text-neutral-700">
                          Incomplete beneficial ownership data for key
                          counterparties
                        </li>
                        <li className="text-sm text-neutral-700">
                          Limited historical transaction baseline (account age{" "}
                          {"<"} 24 months)
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-4">
                      <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                        Evidence required to de-escalate
                      </h4>
                      <ul className="mt-3 space-y-2">
                        <li className="text-sm text-neutral-700">
                          Verified documentation supporting legitimate
                          trade-finance activity
                        </li>
                        <li className="text-sm text-neutral-700">
                          Enhanced due diligence clearance on counterparties
                        </li>
                        <li className="text-sm text-neutral-700">
                          Independent validation of stated business purpose
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <TopRiskDrivers />

                {/* Cross-Case Intelligence */}
                <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Cross-Case Intelligence
                  </h3>
                  <p className="mt-3 text-sm leading-snug text-neutral-700">
                    {CROSS_CASE_SUMMARY}
                  </p>
                  <div className="mt-4 overflow-hidden rounded-lg border border-neutral-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50">
                          <th className="px-3 py-2 text-left font-medium text-neutral-600">
                            Case ID
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-neutral-600">
                            Entity
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-neutral-600">
                            Similarity %
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-neutral-600">
                            Outcome
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-neutral-600">
                            Age
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {RELATED_CASES.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-neutral-100 last:border-0"
                          >
                            <td className="px-3 py-2 font-mono text-neutral-800">
                              {row.caseId}
                            </td>
                            <td className="px-3 py-2 text-neutral-700">
                              {row.entity}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums text-neutral-700">
                              {row.similarityScore}%
                            </td>
                            <td className="px-3 py-2">
                              <RelatedCaseOutcomeBadge outcome={row.outcome} />
                            </td>
                            <td className="px-3 py-2 text-right text-neutral-600">
                              {row.daysAgo}d
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-xs text-neutral-500">
                      <span>Pattern Recurrence Strength</span>
                      <span>
                        {Math.round(
                          RELATED_CASES.reduce((s, c) => s + c.similarityScore, 0) /
                            RELATED_CASES.length
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-neutral-600 transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            RELATED_CASES.reduce((s, c) => s + c.similarityScore, 0) /
                              RELATED_CASES.length
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50/80 px-4 py-3">
                    <p className="text-sm leading-snug text-neutral-700">
                      {CROSS_CASE_INSIGHT}
                    </p>
                  </div>
                </section>
                </>
              )}

              {activeTab === "Initial Escalation Record" && (
                <div className="space-y-4">
                  {escalationRecord ? (
                    <>
                      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          Escalation Rationale (locked)
                        </h3>
                        <p className="mt-2 text-xs text-neutral-500">
                          This rationale was captured at escalation and cannot be edited. Amendments require versioning and a log entry.
                        </p>
                        <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800">
                          {escalationRecord.rationale}
                        </pre>
                      </section>
                      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                          Escalation metadata
                        </h3>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                          <div><dt className="text-neutral-500">Escalated by</dt><dd className="font-medium text-neutral-900">{escalationRecord.userId}</dd></div>
                          <div><dt className="text-neutral-500">Escalation timestamp</dt><dd className="font-medium text-neutral-900 tabular-nums">{escalationRecord.timestamp}</dd></div>
                          <div><dt className="text-neutral-500">Triggers met at escalation</dt><dd className="font-medium text-neutral-900 tabular-nums">{escalationRecord.triggersMet} of {escalationRecord.triggersTotal}</dd></div>
                          <div><dt className="text-neutral-500">Policy threshold</dt><dd className="font-medium text-neutral-900 tabular-nums">{escalationRecord.threshold}</dd></div>
                          <div><dt className="text-neutral-500">Deviation % (90-day baseline)</dt><dd className="font-medium text-neutral-900 tabular-nums">{escalationRecord.deviationPct}%</dd></div>
                          <div><dt className="text-neutral-500">Time gap (hours)</dt><dd className="font-medium text-neutral-900 tabular-nums">{escalationRecord.timeGapHours}h</dd></div>
                        </dl>
                      </section>
                      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                          Trigger snapshot at time of escalation
                        </h3>
                        <ul className="space-y-1.5 text-sm">
                          {escalationRecord.triggerSnapshot.map((t, i) => (
                            <li key={i} className="flex items-center gap-2">
                              {t.met ? <span className="text-red-600" aria-label="Met">✓</span> : <span className="text-neutral-300" aria-label="Not met">✗</span>}
                              <span className={t.met ? "text-neutral-900" : "text-neutral-500"}>{t.label}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                          Case status transition history
                        </h3>
                        <ul className="space-y-2 text-sm">
                          {caseStatusTransitionHistory.map((t, i) => (
                            <li key={i} className="flex flex-wrap gap-x-2 gap-y-0.5">
                              <span className="font-medium text-neutral-500">{t.from}</span>
                              <span aria-hidden>→</span>
                              <span className="font-medium text-neutral-900">{t.to}</span>
                              <span className="text-neutral-500">· {t.timestamp}</span>
                              <span className="text-neutral-500">· {t.userId}</span>
                            </li>
                          ))}
                          {caseStatusTransitionHistory.length === 0 && (
                            <li className="text-neutral-500">No transitions recorded yet.</li>
                          )}
                        </ul>
                      </section>
                    </>
                  ) : (
                    <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                      <p className="text-sm text-neutral-600">
                        No escalation record yet. Use the <strong>Escalate</strong> button in the card above and confirm escalation to create the Initial Escalation Record.
                      </p>
                    </section>
                  )}
                </div>
              )}

              {activeTab === "Other" && (
                <>
                {/* 7. Intelligent SAR Builder */}
                <section className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                  <div className="border-b border-neutral-200 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Intelligent SAR Builder
                      </h3>
                      <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-500">
                        v1 · Last saved 2h ago
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-6">
                    {/* Auto-Aggregated Metrics */}
                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-3">
                        Auto-aggregated metrics
                      </h4>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3">
                          <p className="text-xs text-neutral-500">Total suspicious amount</p>
                          <p className="mt-0.5 font-semibold tabular-nums text-neutral-900">{SAR_METRICS.totalSuspiciousAmount}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3">
                          <p className="text-xs text-neutral-500">Transaction count</p>
                          <p className="mt-0.5 font-semibold tabular-nums text-neutral-900">{SAR_METRICS.transactionCount}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3">
                          <p className="text-xs text-neutral-500">Velocity vs baseline</p>
                          <p className="mt-0.5 text-sm font-medium text-neutral-800">{SAR_METRICS.velocityVsBaseline}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3 sm:col-span-2">
                          <p className="text-xs text-neutral-500">Top counterparties</p>
                          <p className="mt-0.5 text-sm text-neutral-800">{SAR_METRICS.topCounterparties.join("; ")}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3">
                          <p className="text-xs text-neutral-500">Jurisdiction breakdown</p>
                          <p className="mt-0.5 text-sm text-neutral-800">{SAR_METRICS.jurisdictionBreakdown}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3 sm:col-span-3">
                          <p className="text-xs text-neutral-500">Transaction clustering summary</p>
                          <p className="mt-0.5 text-sm text-neutral-800">{SAR_METRICS.clusteringSummary}</p>
                        </div>
                      </div>
                    </div>

                    {/* Subject Occupation & BO Status — above SAR Narrative Draft */}
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700">Subject Occupation (if individual)</label>
                        <input
                          type="text"
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          placeholder="e.g., Software Engineer, Retired"
                          disabled={sarFinalized}
                          className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700">Beneficial Ownership Status</label>
                        <select
                          value={boStatus}
                          onChange={(e) => setBoStatus(e.target.value)}
                          disabled={sarFinalized}
                          className="mt-1 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
                        >
                          <option value="Verified">Verified</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Applicable">Not Applicable</option>
                          <option value="N/A (Entity)">N/A (Entity)</option>
                        </select>
                      </div>
                    </div>

                    {/* SAR Narrative Draft — single editable field, filing-ready */}
                    <div className={sarFinalized ? "opacity-90" : ""}>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                          SAR Narrative Draft
                        </h4>
                        {sarFinalized && (
                          <span className="rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600">
                            Locked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mb-3">
                        {sarFinalized
                          ? "Immutable. Snapshot captured at filing. This draft is included in the SAR filing package."
                          : "Investigator-authored narrative. Add, edit, or expand. Real-time compliance checks below."}
                      </p>
                      <textarea
                        value={sarNarrativeDraft}
                        onChange={(e) => setSarNarrativeDraft(e.target.value)}
                        readOnly={sarFinalized}
                        rows={14}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm leading-relaxed text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-600"
                        placeholder="Narrative will be auto-generated from structured content. Edit freely."
                      />
                      {/* Real-time compliance guardrails */}
                      <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50/80 p-4">
                        <h5 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
                          Compliance guardrails
                        </h5>
                        {(() => {
                          const guard = checkComplianceGuardrails(sarNarrativeDraft, occupation);
                          const hasIssues = guard.accusatory.length > 0 || guard.speculative.length > 0 || guard.missing.length > 0;
                          if (!hasIssues && sarNarrativeDraft.length > 0)
                            return <p className="text-xs text-neutral-600">No accusatory or speculative phrasing detected. Regulator-safe tone maintained.</p>;
                          return (
                            <ul className="space-y-1 text-xs">
                              {guard.accusatory.map((msg, i) => (
                                <li key={i} className="text-red-700">• {msg}</li>
                              ))}
                              {guard.speculative.map((msg, i) => (
                                <li key={i} className="text-amber-700">• {msg}</li>
                              ))}
                              {guard.missing.map((msg, i) => (
                                <li key={i} className="text-amber-700">• Missing: {msg}</li>
                              ))}
                            </ul>
                          );
                        })()}
                      </div>
                      {/* Toggle: View AI-Generated Narrative Structure */}
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setViewNarrativeStructure((v) => !v)}
                          className="text-xs font-medium text-neutral-500 hover:text-neutral-700"
                        >
                          {viewNarrativeStructure ? "▼ Hide" : "▶ View"} AI-generated narrative structure
                        </button>
                        {viewNarrativeStructure && (
                          <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50/80 p-4">
                            <p className="text-xs text-neutral-500 mb-3">Structured breakdown for audit traceability. Values shown are resolved from tokens.</p>
                            <div className="space-y-3">
                              {SAR_NARRATIVE_SECTIONS.map((section, i) => {
                                const resolved = section.content.replace(/\[(\w+)\]/g, (_, key) => SAR_TOKEN_VALUES[key] ?? `[${key}]`);
                                return (
                                  <div key={i} className="rounded border border-neutral-100 bg-white p-3">
                                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{section.title}</p>
                                    <p className="mt-1.5 text-sm leading-snug text-neutral-700">{resolved}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QA / Completeness Panel */}
                    {(() => {
                      const occupationFilled = occupation.trim() !== "";
                      const boSet = ["Verified", "Pending", "Not Applicable", "N/A (Entity)"].includes(boStatus);
                      const bothFilled = occupationFilled && boSet;
                      const completenessScore = bothFilled ? 100 : SAR_QA.narrativeCompletenessScore;
                      const missingFiltered = SAR_QA.missingElements.filter((el) => !(el.toLowerCase().includes("occupation") && occupationFilled));
                      return (
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-4">
                      <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-3">
                        QA / Completeness
                      </h4>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-900">Completeness</span>
                          <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs font-semibold tabular-nums text-neutral-800">
                            {completenessScore}%
                          </span>
                        </div>
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-200">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${completenessScore}%` }}
                          />
                        </div>
                      </div>
                      {missingFiltered.length > 0 && (
                        <p className="mt-2 text-xs text-amber-700">
                          Missing: {missingFiltered.join("; ")}
                        </p>
                      )}
                      {SAR_QA.weakJustification === 0 && SAR_QA.speculativeLanguageFlags === 0 && (
                        <p className="mt-1 text-xs text-neutral-600">No weak justification or speculative language detected.</p>
                      )}
                    </div>
                      );
                    })()}

                    {/* Final Action & Case Disposition */}
                    <div className="rounded-lg border-2 border-neutral-300 bg-neutral-50/80 p-5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-4">
                        Final action & case disposition
                      </h4>
                      <p className="text-xs text-neutral-500 mb-4">
                        Converts draft into auditable compliance action. All actions are logged.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setFileSarModalOpen(true)}
                          disabled={sarFinalized || caseStatus === "Filed"}
                          className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {sarFinalized || caseStatus === "Filed" ? "SAR filed" : "File SAR"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setReturnForDocModalOpen(true)}
                          disabled={sarFinalized || caseStatus === "Filed"}
                          className="rounded-lg border-2 border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Return for additional documentation
                          {returnForDocCount > 0 && (
                            <span className="ml-1.5 rounded bg-neutral-200 px-1.5 py-0.5 text-xs tabular-nums">
                              {returnForDocCount}
                            </span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCloseInsufficientModalOpen(true)}
                          disabled={sarFinalized || caseStatus === "Filed"}
                          className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Close – Insufficient suspicion
                        </button>
                      </div>
                      {sarFinalized && (
                        <p className="mt-3 text-xs text-neutral-600">
                          Narrative locked. SAR V{sarVersion} snapshot captured (confidence {analysis?.confidence_score}%, risk {analysis?.risk_recommendation}). Filing package: final narrative, transaction table, evidence appendix, version history.
                        </p>
                      )}

                      {/* Decision Audit Log */}
                      <div className="mt-5 border-t border-neutral-200 pt-4">
                        <h5 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
                          Decision audit log
                        </h5>
                        <ul className="space-y-2">
                          {decisionAuditLog.map((entry, i) => (
                            <li key={i} className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-neutral-700">
                              <span className="font-medium tabular-nums text-neutral-500">
                                {entry.timestamp || "—"}
                              </span>
                              <span className="font-medium text-neutral-800">{entry.user}</span>
                              <span>{entry.action}</span>
                              {entry.delta != null && entry.delta !== "" && (
                                <span className="text-neutral-500">· {entry.delta}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Regulatory-Safe Language */}
                    <p className="text-xs text-neutral-500">
                      Regulatory-safe language: accusatory phrasing replaced with compliant wording (e.g. “may warrant investigation,” “no determination of guilt”).
                    </p>

                    {/* One-Click Export */}
                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
                        Export
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleExportSarNarrative}
                          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                          SAR narrative
                        </button>
                        <button
                          type="button"
                          onClick={handleExportTransactionAttachment}
                          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                          Structured transaction attachment
                        </button>
                        <button
                          type="button"
                          onClick={handleExportTimeline}
                          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                          Timeline visualization
                        </button>
                        <button
                          type="button"
                          onClick={handleExportEvidenceAppendix}
                          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                          Evidence appendix
                        </button>
                      </div>
                    </div>

                    {/* Expandable technical detail drawer */}
                    <div className="border-t border-neutral-200 pt-4">
                      <button
                        type="button"
                        onClick={() => setSarTechnicalDrawerOpen((v) => !v)}
                        className="text-xs font-medium text-neutral-500 hover:text-neutral-700"
                      >
                        {sarTechnicalDrawerOpen ? "▼ Hide" : "▶ Show"} technical detail & token list
                      </button>
                      {sarTechnicalDrawerOpen && (
                        <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 font-mono text-xs text-neutral-600">
                          <p className="font-sans text-xs font-medium text-neutral-500 mb-2">Injected tokens</p>
                          <p>ENTITY_NAME, ENTITY_ID, ACCOUNT_OPEN_DATE, DATE_RANGE, TX_COUNT, TOTAL_AMOUNT, PCT_VS_BASELINE</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 shadow-sm">
            Select an alert to view details
          </div>
        )}
      </main>
      </div>

      {/* Toast — top-right */}
      {toast.show && (
        <div
          className="fixed right-6 top-20 z-50 rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-lg"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-medium text-neutral-800">
            {toast.message}
          </p>
        </div>
      )}

      {/* Override Decision modal */}
      {overrideModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOverrideModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="override-modal-title"
        >
          <div
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="override-modal-title"
              className="text-base font-semibold text-neutral-900"
            >
              Override decision
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Provide a justification for overriding the AI recommendation. This
              will be recorded in the decision log.
            </p>
            <textarea
              value={overrideJustification}
              onChange={(e) => setOverrideJustification(e.target.value)}
              placeholder="Enter justification..."
              rows={4}
              className="mt-4 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setOverrideModalOpen(false);
                  setOverrideJustification("");
                }}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOverrideSubmit}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Submit override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Escalation – Initial Escalation Record modal */}
      {escalationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEscalationModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-escalation-title"
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl border border-neutral-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirm-escalation-title" className="shrink-0 border-b border-neutral-200 px-6 py-4 text-base font-semibold text-neutral-900">
              Confirm Escalation – Initial Escalation Record
            </h2>
            <p className="shrink-0 px-6 pt-3 text-xs text-neutral-500">
              Review and edit escalation rationale if needed. After confirmation, the rationale is locked and cannot be edited without versioning and a log amendment.
            </p>
            <div className="flex-1 min-h-0 overflow-auto px-6 py-3">
              <textarea
                value={escalationRationaleDraft}
                onChange={(e) => setEscalationRationaleDraft(e.target.value)}
                rows={16}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                placeholder="Escalation rationale…"
              />
            </div>
            <div className="shrink-0 flex justify-end gap-2 px-6 py-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  setEscalationModalOpen(false);
                  setEscalationRationaleDraft("");
                }}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscalateConfirm}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File SAR confirmation modal */}
      {fileSarModalOpen && analysis && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setFileSarModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="file-sar-title"
        >
          <div
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="file-sar-title" className="text-base font-semibold text-neutral-900">
              File SAR
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              This action will finalize SAR documentation. Narrative will be locked and an immutable version snapshot (V{sarVersion + 1}) will be created. Continue?
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Captured: timestamp, user, AI confidence {analysis.confidence_score}%, risk {analysis.risk_recommendation}. Package: final narrative, transaction table, evidence appendix, version history.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFileSarModalOpen(false)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFileSarConfirm}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Finalize SAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return for additional documentation modal */}
      {returnForDocModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setReturnForDocModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="return-doc-title"
        >
          <div
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="return-doc-title" className="text-base font-semibold text-neutral-900">
              Return for additional documentation
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Mandatory comment required. Decision will be logged. Narrative remains editable.
            </p>
            <textarea
              value={returnForDocComment}
              onChange={(e) => setReturnForDocComment(e.target.value)}
              placeholder="Enter rationale..."
              rows={4}
              className="mt-4 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setReturnForDocModalOpen(false);
                  setReturnForDocComment("");
                }}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReturnForDocSubmit}
                disabled={!returnForDocComment.trim()}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close – Insufficient suspicion modal */}
      {closeInsufficientModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setCloseInsufficientModalOpen(false);
            setCloseInsufficientReason("");
            setCloseInsufficientOtherText("");
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="close-insufficient-title"
        >
          <div
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="close-insufficient-title" className="text-base font-semibold text-neutral-900">
              Close – Insufficient suspicion
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Select primary reason. Override vs AI recommendation will be stored for calibration.
            </p>
            <div className="mt-4 space-y-2">
              {[
                { value: "pattern_explained", label: "Pattern explained" },
                { value: "data_error", label: "Data error" },
                { value: "legitimate", label: "Legitimate business activity confirmed" },
                { value: "other", label: "Other (free text required)" },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="closeReason"
                    checked={closeInsufficientReason === value}
                    onChange={() => setCloseInsufficientReason(value as typeof closeInsufficientReason)}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-neutral-800">{label}</span>
                </label>
              ))}
            </div>
            {closeInsufficientReason === "other" && (
              <textarea
                value={closeInsufficientOtherText}
                onChange={(e) => setCloseInsufficientOtherText(e.target.value)}
                placeholder="Required: describe reason..."
                rows={2}
                className="mt-3 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setCloseInsufficientModalOpen(false);
                  setCloseInsufficientReason("");
                  setCloseInsufficientOtherText("");
                }}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloseInsufficientSubmit}
                disabled={
                  !closeInsufficientReason ||
                  (closeInsufficientReason === "other" && !closeInsufficientOtherText.trim())
                }
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
