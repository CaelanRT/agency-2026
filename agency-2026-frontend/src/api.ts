export const BASE_URL = 'http://localhost:3001';

import type { Recipient } from './types';

interface MinistriesResponse {
  ministries: string[];
}

interface RecipientsResponse {
  recipients: Recipient[];
  ministry_total: number;
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
