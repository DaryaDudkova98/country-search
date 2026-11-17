export interface RawLanguage {
  name?: string;
  common?: string;
  official?: string;
}

export interface RawName {
  common?: string;
  official?: string;
}

export interface RawCountryResponse {
  name?: string | RawName;
  capital?: string[] | string;
  region?: string;
  population?: number;
  flags?: { svg?: string };
  languages?: Record<string, string | RawLanguage> | (string | RawLanguage)[];
  area?: number;
  borders?: string[];
  currencies?: Record<string, { name: string; symbol?: string }>;
}

export interface CountryCardData {
  name: string;
  capital: string;
  region: string;
  population: number;
  flag: string;
  languages: string;
  area: string;
  borders: string;
  currency: string;
}

const formatRuNumber = (value: number): string =>
  value.toLocaleString('ru-RU').replace(/\u00A0/g, ' ');

export function mapCountryResponse(raw: RawCountryResponse): CountryCardData {
  let countryName = 'Unknown';
  if (typeof raw.name === 'object' && raw.name !== null) {
    countryName = raw.name.common || raw.name.official || 'Unknown';
  } else if (typeof raw.name === 'string') {
    countryName = raw.name;
  }

  let capitalName = '—';
  if (Array.isArray(raw.capital) && raw.capital.length > 0) {
    capitalName = raw.capital[0];
  } else if (typeof raw.capital === 'string') {
    capitalName = raw.capital;
  }

  let languagesString = '—';
  if (raw.languages) {
    let langValues: string[] = [];

    if (Array.isArray(raw.languages)) {
      langValues = raw.languages.map((lang) => {
        if (typeof lang === 'object' && lang !== null) {
          return lang.name || lang.common || lang.official || '';
        }
        return String(lang);
      });
    } else if (typeof raw.languages === 'object') {
      langValues = Object.values(raw.languages).map((lang) => {
        if (typeof lang === 'object' && lang !== null) {
          return lang.name || lang.common || lang.official || '';
        }
        return String(lang);
      });
    }

    const filtered = langValues.filter(Boolean);
    if (filtered.length > 0) {
      languagesString = filtered.join(', ');
    }
  }

  const areaString = raw.area ? `${formatRuNumber(raw.area)} км²` : '—';

  const bordersString =
    raw.borders && raw.borders.length > 0 ? raw.borders.join(', ') : 'No land borders';

  let currencyString = '—';
  if (raw.currencies) {
    currencyString = Object.values(raw.currencies)
      .map((c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`)
      .join(', ');
  }

  return {
    name: countryName,
    capital: capitalName,
    region: raw.region || 'Unknown',
    population: raw.population || 0,
    flag: raw.flags?.svg || '',
    languages: languagesString,
    area: areaString,
    borders: bordersString,
    currency: currencyString,
  };
}
