export type Ministry = string;

export interface Recipient {
  recipient: string;
  total_spend: number;
  sole_source_spend: number;
  share: number;
}

export interface SummaryResponse {
  summary: string;
}

export interface InvestigationResult {
  answer: string;
  evidence: string[];
  steps: string[];
  next_steps: string[];
}

export interface MinistryRiskItem {
  ministry: string;
  top_vendor_share: number;
  top_3_share: number;
  sole_source_share: number;
  total_spend: number;
  risk_score: number;
}
