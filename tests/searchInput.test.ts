import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSearchHandler } from '../src/logic/searchInput';
import * as searchCountriesModule from '../src/logic/searchCountries';

describe('search input handling', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    vi.spyOn(searchCountriesModule, 'searchCountries').mockImplementation(
      (query, signal) => {
        return new Promise((resolve, reject) => {
          if (signal.aborted) {
            return reject(signal.reason);
          }
          signal.addEventListener('abort', () => reject(signal.reason));

        });
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('aborts the previous request immediately on a new input', async () => {
    const onInput = createSearchHandler();

    onInput('j');
    vi.advanceTimersByTime(300);

    expect(searchCountriesModule.searchCountries).toHaveBeenCalledTimes(1);
    const firstSignal = vi.mocked(searchCountriesModule.searchCountries).mock.calls[0]![1];
    expect(firstSignal.aborted).toBe(false);

    onInput('ja');

    expect(firstSignal.aborted).toBe(true);

    await vi.runAllTimersAsync();

    vi.advanceTimersByTime(300);
    expect(searchCountriesModule.searchCountries).toHaveBeenCalledTimes(2);
  });

  test('handles timeout error (TimeoutError) separately from AbortError', async () => {
    const onError = vi.fn();
    const onInput = createSearchHandler(() => {}, onError);

    onInput('japan');

    vi.advanceTimersByTime(300);
    expect(searchCountriesModule.searchCountries).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5000);

    await vi.runAllTimersAsync();

    expect(onError).toHaveBeenCalledTimes(1);
    const error = onError.mock.calls[0]![0];
    expect(error).toBeInstanceOf(DOMException);
    expect((error as DOMException).name).toBe('TimeoutError');
  });
});