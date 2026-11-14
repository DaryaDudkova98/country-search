import { describe, test, expect } from 'vitest';
import { mapCountryResponse } from '../src/logic/mapCountryResponse';

describe('mapCountryResponse', () => {
  test('transforms raw API data into card data', () => {
    const rawApiResponse = {
      name: { common: 'Japan', official: 'Japan' },
      capital: ['Tokyo'],
      region: 'Asia',
      population: 125836021,
      flags: { svg: 'https://flagcdn.com/jp.svg', alt: 'Flag of Japan' },
      languages: { jpn: 'Japanese' },
      area: 377975,
      borders: ['KOR', 'PRK'],
      currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
    };

    const result = mapCountryResponse(rawApiResponse);

    expect(result).toEqual({
      name: 'Japan',
      capital: 'Tokyo',
      region: 'Asia',
      population: 125836021,
      flag: 'https://flagcdn.com/jp.svg',
      languages: 'Japanese',
      area: '377 975 км²',
      borders: 'KOR, PRK',
      currency: 'Japanese yen (¥)',
    });
  });

  test('handles missing or empty fields gracefully', () => {
    const rawApiResponse = {
      name: { common: 'Antarctica' },
      capital: [],
      region: undefined,
      population: 0,
      flags: {},
      languages: {},
    };

    const result = mapCountryResponse(rawApiResponse);

    expect(result.name).toBe('Antarctica');
    expect(result.capital).toBe('—');
    expect(result.region).toBe('Unknown');
    expect(result.languages).toBe('—');
    expect(result.area).toBe('—');
    expect(result.borders).toBe('No land borders');
    expect(result.currency).toBe('—');
  });
});