import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchCountries } from '../src/logic/searchCountries';
import { HttpError } from '../src/logic/HttpError';

describe('searchCountries', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('resolves to an array of countries when response is ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [{ name: 'Japan' }],
    } as Response);

    const signal = new AbortController().signal;
    const result = await searchCountries('japan', signal);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([{ name: 'Japan' }]);
  });

  test('resolves to an empty array on 404 (no matches, not an error)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const signal = new AbortController().signal;
    const result = await searchCountries('unknown', signal);

    expect(result).toEqual([]);
  });

  test('rejects with HttpError on 500 (real error)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const signal = new AbortController().signal;

    await expect(searchCountries('japan', signal)).rejects.toBeInstanceOf(HttpError);
  });

  test('passes the AbortSignal to fetch', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => [] } as Response);
    const controller = new AbortController();

    await searchCountries('japan', controller.signal);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('japan'),
      expect.objectContaining({ signal: controller.signal })
    );
  });
});