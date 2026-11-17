import { HttpError } from './HttpError';
import type { RawCountryResponse } from './mapCountryResponse';

export async function searchCountries(
  query: string,
  signal: AbortSignal
): Promise<RawCountryResponse[]> {
  const url = `https://countries.dev/name/${encodeURIComponent(query)}?fields=name,capital,population,flags,languages,region,area,borders,currencies`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new HttpError(response.status);
  }

  const data: unknown = await response.json();
  return data as RawCountryResponse[];
}