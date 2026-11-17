import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSearchHandler } from '../src/logic/searchInput';
import * as searchCountriesModule from '../src/logic/searchCountries';

describe('search input handling', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    vi.stubGlobal('AbortSignal', {
      ...AbortSignal,
      timeout: (ms: number) => {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(new DOMException('Timeout', 'TimeoutError')), ms);
        return ctrl.signal;
      },
    });

    vi.spyOn(searchCountriesModule, 'searchCountries').mockImplementation(
      (_query, signal) =>
        new Promise((_resolve, reject) => {
          if (signal.aborted) return reject(signal.reason);
          signal.addEventListener('abort', () => reject(signal.reason), { once: true });
        })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('aborts the previous request immediately on a new input', async () => {
    const onInput = createSearchHandler();

    onInput('j');
    await vi.advanceTimersByTimeAsync(300);

    expect(searchCountriesModule.searchCountries).toHaveBeenCalledTimes(1);
    const firstSignal = vi.mocked(searchCountriesModule.searchCountries).mock.calls[0]![1]!;
    expect(firstSignal.aborted).toBe(false);

    onInput('ja');

    expect(firstSignal.aborted).toBe(true);
    expect(firstSignal.reason).toBeInstanceOf(DOMException);
    expect((firstSignal.reason as DOMException).name).toBe('AbortError');

    await vi.advanceTimersByTimeAsync(300);
    expect(searchCountriesModule.searchCountries).toHaveBeenCalledTimes(2);
  });

  test('handles timeout error (TimeoutError) separately from AbortError', async () => {
    const onError = vi.fn();
    const onInput = createSearchHandler(() => {}, onError);

    onInput('japan');

    await vi.advanceTimersByTimeAsync(300);
    expect(searchCountriesModule.searchCountries).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(5000);

    await Promise.resolve();

    expect(onError).toHaveBeenCalledTimes(1);
    const error = onError.mock.calls[0]![0];
    expect(error).toBeInstanceOf(DOMException);
    expect((error as DOMException).name).toBe('TimeoutError');
  });

  test('does not call onError when aborted by new input', async () => {
    const onError = vi.fn();
    const onInput = createSearchHandler(() => {}, onError);

    onInput('japan');
    await vi.advanceTimersByTimeAsync(300);

    onInput('japanese');
    await vi.advanceTimersByTimeAsync(0);

    expect(onError).not.toHaveBeenCalled();
  });
});
