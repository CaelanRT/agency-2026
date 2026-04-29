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
