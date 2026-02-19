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

type EvidenceTab = "transactions" | "customer_attributes" | "rule_triggers";

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
    counterpartyCountry: "CY",
    description: "Outbound wire to CY beneficiary with no prior transaction history; amount exceeds 90-day baseline by 240%. Stated purpose trade settlement; no supporting documentation on file.",
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
    counterpartyCountry: "US",
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
    counterpartyCountry: "AE",
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
    counterpartyCountry: "RU",
    description: "Counterparty name and address match to OFAC designated list; transaction placed on hold pending compliance review. RU jurisdiction; no prior screening hit for this account.",
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
    counterpartyCountry: "SE",
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
    counterpartyCountry: "US",
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
    counterpartyCountry: "CN",
    description: "Invoice amount materially exceeds customs declaration for same shipment. Possible trade-based value movement; CN counterparty; escalation for document review.",
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
    counterpartyCountry: "VG",
    description: "Wire beneficiary name does not match account holder on file. First-time payment to VG entity; no prior relationship or explanation for discrepancy.",
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
    counterpartyCountry: "US",
    description: "Twelve small transfers to same exchange within 24 hours; amounts below $5k each. Possible structuring to avoid reporting; no declared crypto activity on account.",
    riskLevel: "Medium",
  },
  {
    id: "ALRT-2024-010",
    title: "Single wire to high-risk jurisdiction (VG)",
    entityName: "Coastal Trading Inc",
    entityId: "CUST-40955",
    type: "Wire",
    date: "2024-09-30",
    amount: "$8,750.25",
    counterpartyCountry: "VG",
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
    counterpartyCountry: "US",
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
    counterpartyCountry: "US",
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
    counterpartyCountry: "DE",
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
      { date: "2025-02-14", amount: "$45,000", country: "CY", flag_reason: "High-risk jurisdiction" },
      { date: "2025-02-12", amount: "$32,000", country: "VG", flag_reason: "Round-dollar; velocity" },
      { date: "2025-02-10", amount: "$28,500", country: "CY", flag_reason: "Repeat counterparty" },
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
      "Between [DATE_RANGE], subject conducted [TX_COUNT] outbound transactions totaling [TOTAL_AMOUNT]. Activity concentrated in 14-day window; [PCT_VS_BASELINE] above 90-day baseline.",
    tokens: ["DATE_RANGE", "TX_COUNT", "TOTAL_AMOUNT", "PCT_VS_BASELINE"],
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
  topCounterparties: ["Counterparty A (CY)", "Counterparty B (VG)", "Counterparty C (CY)"],
  jurisdictionBreakdown: "CY: 58% | VG: 42%",
  velocityVsBaseline: "3.4x above 90-day baseline",
  clusteringSummary: "3 clusters in 14 days; avg $8,792/cluster",
};

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
  PCT_VS_BASELINE: "240%",
};

function getMergedSarNarrative(occupation?: string, boStatus?: string): string {
  const base = SAR_NARRATIVE_SECTIONS.map((s) => s.content).join("\n\n").replace(/\[(\w+)\]/g, (_, key) => SAR_TOKEN_VALUES[key] ?? `[${key}]`);
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
  | "Closed"
  | "Filed"
  | "Override – Manual Review";

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

function TopRiskDrivers() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Top Risk Drivers (5 of 18 model factors shown)
      </h3>
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
                  <p className="mt-1.5 rounded border border-neutral-100 bg-neutral-50 px-2.5 py-2 font-mono text-[11px] text-neutral-600">
                    {driver.technicalDetails}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        The model evaluates 18 behavioral and contextual risk factors. Top
        contributors shown.
      </p>
    </section>
  );
}

export default function Home() {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>("ALRT-2024-001");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzedResults, setAnalyzedResults] = useState<Record<string, AnalysisResult>>({});
  const [evidenceTab, setEvidenceTab] = useState<EvidenceTab>("transactions");
  const [activeTab, setActiveTab] = useState<"Summary" | "SAR Filing">("Summary");
  const [sarTechnicalDrawerOpen, setSarTechnicalDrawerOpen] = useState(false);
  const [sarNarrativeDraft, setSarNarrativeDraft] = useState("");
  const [occupation, setOccupation] = useState("");
  const [boStatus, setBoStatus] = useState<string>("Not Applicable");
  const [viewNarrativeStructure, setViewNarrativeStructure] = useState(false);
  const [caseStatus, setCaseStatus] = useState<CaseStatus>("Open");
  const [decisionLog, setDecisionLog] = useState<string[]>([]);
  const [decisionTaken, setDecisionTaken] = useState(false);
  const [alertStatuses, setAlertStatuses] = useState<Record<string, string>>({});
  const [needsReviewCount, setNeedsReviewCount] = useState(5);
  const [severityFilter, setSeverityFilter] = useState<string>("All");
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

  const totalAlerts = ALERTS.length;
  const highRisk = ALERTS.filter((a) => a.riskLevel?.toLowerCase() === "high").length;
  const mediumRisk = ALERTS.filter((a) => a.riskLevel?.toLowerCase() === "medium").length;
  const lowRisk = ALERTS.filter((a) => a.riskLevel?.toLowerCase() === "low").length;

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
    setSarNarrativeDraft((prev) => (prev === "" ? getMergedSarNarrative() : prev));
  }, [analysis]);

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
    if (prevStatus === "Open" && removesFromQueue) {
      const alert = ALERTS.find((a) => a.id === alertId);
      const isHighRisk = alert?.riskLevel?.toLowerCase() === "high";
      if (isHighRisk) setNeedsReviewCount((c) => Math.max(0, c - 1));
    }
  };

  const handleEscalate = () => {
    const newStatus = "Escalated";
    if (selectedAlertId) applyAlertStatus(selectedAlertId, newStatus);
    setCaseStatus("Escalated");
    setDecisionLog((prev) => [
      ...prev,
      `Escalated by AI – Accepted by ${CASE_HEADER.assignedAnalyst} – ${formatTimestamp()}`,
    ]);
    setDecisionTaken(true);
    setToast({ show: true, message: `Status updated to ${newStatus}` });
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

  const handleSendToAnalyst = () => {
    const newStatus = "In Review";
    if (selectedAlertId) applyAlertStatus(selectedAlertId, newStatus);
    setCaseStatus("In Review");
    setDecisionLog((prev) => [
      ...prev,
      `Sent to analyst by ${CASE_HEADER.assignedAnalyst} – ${formatTimestamp()}`,
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
            className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 text-sm font-medium"
            aria-hidden
          >
            ?
          </div>
        </div>
      </header>

      {/* KPI summary row */}
      <div className="shrink-0 border-b border-neutral-200 bg-neutral-100 px-8 py-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-200">
            <p className="text-sm font-medium text-neutral-500">Total alerts</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
              {totalAlerts}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-200">
            <p className="text-sm font-medium text-neutral-500">High risk alerts</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-red-700">
              {highRisk}
              {highRisk > 0 && (
                <span className="text-base font-medium text-red-600"> ({needsReviewCount} Needs review)</span>
              )}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-200">
            <p className="text-sm font-medium text-neutral-500">Medium risk alerts</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-amber-700">
              {mediumRisk}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-200">
            <p className="text-sm font-medium text-neutral-500">Low risk alerts</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-emerald-700">
              {lowRisk}
            </p>
          </div>
        </div>
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
              {severityFilter === "All" && statusFilter === "All"
                ? "All severity · All status"
                : `${severityFilter === "All" ? "All severity" : severityFilter} · ${statusFilter === "All" ? "All status" : statusFilter}`}
            </p>
          )}
          {filtersOpen && (
            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 w-full">Severity</span>
                {[
                  { value: "High", label: "HIGH", activeClass: "bg-red-600 text-white border-red-600" },
                  { value: "Medium", label: "MEDIUM", activeClass: "bg-orange-500 text-white border-orange-500" },
                  { value: "Low", label: "LOW", activeClass: "bg-green-600 text-white border-green-600" },
                  { value: "All", label: "All", activeClass: "bg-neutral-700 text-white border-neutral-700" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSeverityFilter(opt.value)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      severityFilter === opt.value ? opt.activeClass : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 w-full">Status</span>
                {[
                  { value: "Open", label: "Open", activeClass: "bg-neutral-500 text-white border-neutral-500" },
                  { value: "Dismissed", label: "Dismissed", activeClass: "bg-neutral-600 text-white border-neutral-600" },
                  { value: "Escalated", label: "Escalated", activeClass: "bg-emerald-600 text-white border-emerald-600" },
                  { value: "In Review", label: "In Review", activeClass: "bg-blue-600 text-white border-blue-600" },
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
            const filteredAlerts = ALERTS.filter((alert) => {
              const matchSeverity = severityFilter === "All" || alert.riskLevel === severityFilter;
              const status = alertStatuses[alert.id] ?? "Open";
              const matchStatus =
                statusFilter === "All" ||
                status === statusFilter ||
                (statusFilter === "In Review" && status === "In Manual Review");
              return matchSeverity && matchStatus;
            });
            return filteredAlerts.map((alert) => {
            const cardAnalysis = analyzedResults[alert.id];
            const risk = (cardAnalysis?.risk_recommendation ?? alert.riskLevel)?.toLowerCase() ?? "low";
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
            const riskBadge = cardAnalysis ? (
              risk === "high" ? (
                <span className="absolute top-2 right-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">HIGH</span>
              ) : risk === "medium" ? (
                <span className="absolute top-2 right-2 rounded bg-orange-500 px-2 py-1 text-xs font-bold text-white">MEDIUM</span>
              ) : (
                <span className="absolute top-2 right-2 rounded bg-green-600 px-2 py-1 text-xs font-bold text-white">LOW</span>
              )
            ) : (
              <span className="absolute top-2 right-2 rounded bg-neutral-400 px-2 py-1 text-xs font-medium text-white">Analyzing…</span>
            );
            const riskTint =
              risk === "high"
                ? "border-neutral-100 bg-red-50 hover:border-red-200 hover:bg-red-100"
                : risk === "medium"
                  ? "border-neutral-100 bg-amber-50 hover:border-amber-200 hover:bg-amber-100"
                  : "border-neutral-100 bg-gray-50 hover:border-neutral-200 hover:bg-neutral-100";
            return (
              <li key={alert.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlertId(alert.id);
                    setAnalysis(cardAnalysis ?? null);
                  }}
                  className={`relative mb-2 w-full rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                    isSelected ? "border-blue-200 bg-blue-50/80 shadow-sm" : riskTint
                  }`}
                >
                  {riskBadge}
                  <span className="block pr-16 font-medium text-neutral-900">
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
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Status</span>
                    <span className={`ml-1.5 inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium ${statusPillClass}`}>
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
            {/* Alert + Case — single merged card */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">{selectedAlert.title}</h3>
                  <p className="text-sm text-neutral-600">{selectedAlert.entityName} ({selectedAlert.entityId})</p>
                </div>
                {(() => {
                  const risk = (analysis?.risk_recommendation ?? selectedAlert.riskLevel)?.toLowerCase() ?? "low";
                  return risk === "high" ? (
                    <span className="rounded bg-red-600 px-3 py-1 text-xs font-bold text-white">HIGH</span>
                  ) : risk === "medium" ? (
                    <span className="rounded bg-orange-500 px-3 py-1 text-xs font-bold text-white">MEDIUM</span>
                  ) : (
                    <span className="rounded bg-green-600 px-3 py-1 text-xs font-bold text-white">LOW</span>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-neutral-500">Type</div>
                  <div className="text-sm font-medium text-neutral-900">{selectedAlert.type}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500">Date</div>
                  <div className="text-sm font-medium text-neutral-900">{selectedAlert.date}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500">Amount</div>
                  <div className="text-sm font-medium text-neutral-900">{selectedAlert.amount}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500">Country</div>
                  <div className="text-sm font-medium text-neutral-900">{selectedAlert.counterpartyCountry}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-neutral-500">Description</div>
                <p className="text-sm text-neutral-800 mt-0.5">{selectedAlert.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-200 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Case ID</span>
                  <span className="font-mono font-medium text-neutral-900">{CASE_HEADER.caseId}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Status</span>
                  {(() => {
                    const s = alertStatuses[selectedAlert.id] ?? "Open";
                    const pillClass =
                      s === "Escalated"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : s === "In Review" || s === "In Manual Review"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : s === "Dismissed" || s === "Overridden" || s === "Closed"
                            ? "bg-neutral-100 text-neutral-800 border-neutral-300"
                            : "bg-neutral-50 text-neutral-500 border-neutral-200";
                    return (
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${pillClass}`}>
                        {s}
                      </span>
                    );
                  })()}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Assigned</span>
                  <span className="font-medium text-neutral-900">{CASE_HEADER.assignedAnalyst}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-500">Created</span>
                  <span className="text-neutral-900">{CASE_HEADER.createdDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-500">SLA</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      /0d|^\d+h\s/i.test(CASE_HEADER.slaCountdown) ? "text-red-600" : "text-neutral-900"
                    }`}
                  >
                    {CASE_HEADER.slaCountdown}
                  </span>
                </span>
              </div>

              {decisionLog.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">Decision log</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-neutral-600">
                    {decisionLog.map((entry, i) => (
                      <li key={i}>{entry}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 text-right">
                <button
                  type="button"
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing…
                    </>
                  ) : (
                    "Re-analyze"
                  )}
                </button>
              </div>
            </div>

            {/* Tabs: Summary | SAR Filing — compact spacing */}
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
                    activeTab === "SAR Filing" ? "border-b-2 border-blue-600 text-blue-600" : "text-neutral-600 hover:text-neutral-900"
                  }`}
                  onClick={() => setActiveTab("SAR Filing")}
                >
                  SAR Filing
                </button>
              </div>
            </div>

            {/* Tab content — tight gap below tabs, standard padding */}
            <div className="mt-3 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
              {activeTab === "Summary" && analysis && (
                <>
                {/* AI Risk Intelligence — elevated, accent border */}
                <section
                  className={`rounded-xl border border-neutral-200 border-l-4 bg-white p-6 shadow-md ${
                    analysis.risk_recommendation === "High"
                      ? "border-l-red-500"
                      : analysis.risk_recommendation === "Medium"
                        ? "border-l-amber-500"
                        : "border-l-emerald-500"
                  }`}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    AI Risk Intelligence
                  </h3>
                  <p className="mt-4 text-lg font-semibold leading-snug text-neutral-900">
                    {analysis.executive_ai_conclusion}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <RiskBadge level={analysis.risk_recommendation} />
                    <span className="text-sm font-medium text-neutral-600">
                      Confidence: {analysis.confidence_score}%
                    </span>
                    <div className="w-28">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${analysis.confidence_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-neutral-200 pt-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Recommended action
                    </p>
                    <p className="mt-1 text-base font-bold text-neutral-900">
                      {analysis.recommended_action}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleEscalate}
                        disabled={decisionTaken}
                        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Escalate
                      </button>
                      <button
                        type="button"
                        onClick={handleDismiss}
                        disabled={decisionTaken}
                        className="rounded-lg border-2 border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={handleSendToAnalyst}
                        disabled={decisionTaken}
                        className="rounded-lg border-2 border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Send to Analyst
                      </button>
                    </div>
                  </div>
                </section>

                {/* Case Summary */}
                <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Case Summary
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-neutral-700">
                    {analysis.case_overview}
                  </p>
                </section>

                <TopRiskDrivers />

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

                {/* 5. Evidence Traceability — tabs */}
                <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
                  <h3 className="border-b border-neutral-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Evidence Traceability
                  </h3>
                  <div className="flex border-b border-neutral-200">
                    {(
                      [
                        ["transactions", "Transactions"],
                        ["customer_attributes", "Customer attributes"],
                        ["rule_triggers", "Rule triggers"],
                      ] as const
                    ).map(([tab, label]) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setEvidenceTab(tab)}
                        className={`px-4 py-2 text-xs font-medium transition-colors ${
                          evidenceTab === tab
                            ? "border-b-2 border-neutral-900 text-neutral-900"
                            : "text-neutral-500 hover:text-neutral-700"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="p-4">
                    {evidenceTab === "transactions" && (
                      <div className="overflow-hidden rounded border border-neutral-200">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50">
                              <th className="px-2.5 py-1.5 text-left font-medium text-neutral-600">
                                Date
                              </th>
                              <th className="px-2.5 py-1.5 text-left font-medium text-neutral-600">
                                Amount
                              </th>
                              <th className="px-2.5 py-1.5 text-left font-medium text-neutral-600">
                                Country
                              </th>
                              <th className="px-2.5 py-1.5 text-left font-medium text-neutral-600">
                                Flag reason
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {analysis.evidence_traceability.key_transactions.map(
                              (tx, i) => (
                                <tr
                                  key={i}
                                  className="border-b border-neutral-100 last:border-0"
                                >
                                  <td className="px-2.5 py-1.5 text-neutral-700">
                                    {tx.date}
                                  </td>
                                  <td className="px-2.5 py-1.5 font-medium text-neutral-700">
                                    {tx.amount}
                                  </td>
                                  <td className="px-2.5 py-1.5 text-neutral-700">
                                    {tx.country}
                                  </td>
                                  <td className="px-2.5 py-1.5 text-neutral-600">
                                    {tx.flag_reason}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {evidenceTab === "customer_attributes" && (
                      <div className="overflow-hidden rounded border border-neutral-200">
                        <table className="w-full text-xs">
                          <tbody>
                            {analysis.evidence_traceability.customer_attributes.map(
                              (attr, i) => (
                                <tr
                                  key={i}
                                  className="border-b border-neutral-100 last:border-0"
                                >
                                  <td className="w-1/3 px-2.5 py-1.5 text-neutral-600">
                                    {attr.label}
                                  </td>
                                  <td className="px-2.5 py-1.5 font-medium text-neutral-700">
                                    {attr.value}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {evidenceTab === "rule_triggers" && (
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.evidence_traceability.rule_triggers.map(
                          (rule, i) => (
                            <span
                              key={i}
                              className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-xs text-neutral-700"
                            >
                              {rule}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </section>
                </>
              )}

              {activeTab === "SAR Filing" && (
                <>
                {/* 7. Intelligent SAR Builder */}
                <section className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                  <div className="border-b border-neutral-200 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Intelligent SAR Builder
                      </h3>
                      <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-500">
                        v1 · Last saved 2h ago
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-6">
                    {/* Auto-Aggregated Metrics */}
                    <div>
                      <h4 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-3">
                        Auto-aggregated metrics
                      </h4>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3">
                          <p className="text-[11px] text-neutral-500">Total suspicious amount</p>
                          <p className="mt-0.5 font-semibold tabular-nums text-neutral-900">{SAR_METRICS.totalSuspiciousAmount}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3">
                          <p className="text-[11px] text-neutral-500">Transaction count</p>
                          <p className="mt-0.5 font-semibold tabular-nums text-neutral-900">{SAR_METRICS.transactionCount}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3">
                          <p className="text-[11px] text-neutral-500">Velocity vs baseline</p>
                          <p className="mt-0.5 text-sm font-medium text-neutral-800">{SAR_METRICS.velocityVsBaseline}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3 sm:col-span-2">
                          <p className="text-[11px] text-neutral-500">Top counterparties</p>
                          <p className="mt-0.5 text-sm text-neutral-800">{SAR_METRICS.topCounterparties.join("; ")}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3">
                          <p className="text-[11px] text-neutral-500">Jurisdiction breakdown</p>
                          <p className="mt-0.5 text-sm text-neutral-800">{SAR_METRICS.jurisdictionBreakdown}</p>
                        </div>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/80 p-3 sm:col-span-3">
                          <p className="text-[11px] text-neutral-500">Transaction clustering summary</p>
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
                        <h4 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                          SAR Narrative Draft
                        </h4>
                        {sarFinalized && (
                          <span className="rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">
                            Locked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 mb-3">
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
                        <h5 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
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
                            <p className="text-[11px] text-neutral-500 mb-3">Structured breakdown for audit traceability. Values shown are resolved from tokens.</p>
                            <div className="space-y-3">
                              {SAR_NARRATIVE_SECTIONS.map((section, i) => {
                                const resolved = section.content.replace(/\[(\w+)\]/g, (_, key) => SAR_TOKEN_VALUES[key] ?? `[${key}]`);
                                return (
                                  <div key={i} className="rounded border border-neutral-100 bg-white p-3">
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">{section.title}</p>
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
                      <h4 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-3">
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
                      <p className="text-[11px] text-neutral-500 mb-4">
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
                        <h5 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
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
                    <p className="text-[11px] text-neutral-500">
                      Regulatory-safe language: accusatory phrasing replaced with compliant wording (e.g. “may warrant investigation,” “no determination of guilt”).
                    </p>

                    {/* One-Click Export */}
                    <div>
                      <h4 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
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
                        <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 font-mono text-[11px] text-neutral-600">
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
