import type { Recipient } from './types';

const defaultBaseUrl = 'http://localhost:3001';
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const BASE_URL = (configuredBaseUrl || defaultBaseUrl).replace(/\/$/, '');

interface MinistriesResponse {
  ministries: string[];
}

interface RecipientsResponse {
  recipients: Recipient[];
  ministry_total: number;
}

interface SummaryResponse {
  summary: string;
}

export async function fetchMinistries(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/api/ministries`);

  if (!response.ok) {
    throw new Error(`Ministries request failed with status ${response.status}`);
  }

  const data = (await response.json()) as MinistriesResponse;
  return data.ministries;
}

export async function fetchRecipients(ministry: string): Promise<RecipientsResponse> {
  const response = await fetch(
    `${BASE_URL}/api/recipients?ministry=${encodeURIComponent(ministry)}`
  );

  if (!response.ok) {
    throw new Error(`Recipients request failed with status ${response.status}`);
  }

  return (await response.json()) as RecipientsResponse;
}

export async function fetchSummary(ministry: string): Promise<string> {
  const response = await fetch(
    `${BASE_URL}/api/summary?ministry=${encodeURIComponent(ministry)}`
  );

  if (!response.ok) {
    throw new Error(`Summary request failed with status ${response.status}`);
  }

  const data = (await response.json()) as SummaryResponse;
  return data.summary;
}
