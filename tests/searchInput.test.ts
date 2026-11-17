import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSearchHandler } from '../src/logic/searchInput';

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('search input race conditions', () => {
  let pending: Array<Deferred<Response>>;

  beforeEach(() => {
    vi.useFakeTimers();
    pending = [];

    vi.stubGlobal(
      'fetch',
      vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
        const d = deferred<Response>();
        pending.push(d);

        const signal = init?.signal;
        if (signal) {
          if (signal.aborted) {
            d.reject(new DOMException('Aborted', 'AbortError'));
          } else {
            signal.addEventListener(
              'abort',
              () => d.reject(new DOMException('Aborted', 'AbortError')),
              { once: true }
            );
          }
        }

        return d.promise;
      })
    );

    vi.stubGlobal('AbortSignal', {
      ...AbortSignal,
      timeout: (ms: number) => {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(new DOMException('Timeout', 'TimeoutError')), ms);
        return ctrl.signal;
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('late response of the first request does not override the second request result', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onInput = createSearchHandler(onSuccess, onError);

    onInput('ja');
    await vi.advanceTimersByTimeAsync(300);
    expect(pending).toHaveLength(1);

    onInput('japan');
    await vi.advanceTimersByTimeAsync(300);
    expect(pending).toHaveLength(2);

    await expect(pending[0]!.promise).rejects.toMatchObject({ name: 'AbortError' });

    const secondResult = [{ name: { common: 'Japan' } }];
    pending[1]!.resolve(new Response(JSON.stringify(secondResult), { status: 200 }));

    await vi.advanceTimersByTimeAsync(0);
    await Promise.resolve();

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(secondResult);

    await vi.advanceTimersByTimeAsync(0);
    await Promise.resolve();

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(secondResult);

    expect(onError).not.toHaveBeenCalled();
  });
});
