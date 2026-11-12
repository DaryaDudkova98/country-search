import { HttpError } from './HttpError';

export async function searchCountries(query: string, signal: AbortSignal): Promise<any[]> {
  const url = `https://countries.dev/name/${encodeURIComponent(query)}?fields=name,capital,population,flags,languages,region`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new HttpError(response.status);
  }

  const data = await response.json();
  return data;
}