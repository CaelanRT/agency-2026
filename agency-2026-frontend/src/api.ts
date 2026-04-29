export const BASE_URL = 'http://localhost:3001';

interface MinistriesResponse {
  ministries: string[];
}

export async function fetchMinistries(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/api/ministries`);

  if (!response.ok) {
    throw new Error(`Ministries request failed with status ${response.status}`);
  }

  const data = (await response.json()) as MinistriesResponse;
  return data.ministries;
}
