export interface CountryCardData {
  name: string;
  capital: string;
  region: string;
  population: number;
  flag: string;
  languages: string;
}

export function mapCountryResponse(raw: any): CountryCardData {
  return {
    name: raw.name?.common || 'Unknown',
    capital: raw.capital?.[0] || 'N/A',
    region: raw.region || 'Unknown',
    population: raw.population || 0,
    flag: raw.flags?.svg || '',
    languages: Object.values(raw.languages || {}).join(', ') || 'N/A',
  };
}