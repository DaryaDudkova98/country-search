import { debounce } from './debounce';
import { searchCountries } from './searchCountries';

const TIMEOUT_MS = 5000;

function withTimeout(signal: AbortSignal, ms: number): AbortSignal {
  const timeoutSignal =
    typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(ms)
      : createManualTimeoutSignal(ms);

  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any([signal, timeoutSignal]);
  }

  return combineSignals([signal, timeoutSignal]);
}

function createManualTimeoutSignal(ms: number): AbortSignal {
  const ctrl = new AbortController();
  setTimeout(
    () => ctrl.abort(new DOMException('Timeout', 'TimeoutError')),
    ms,
  );
  return ctrl.signal;
}

function combineSignals(signals: AbortSignal[]): AbortSignal {
  const ctrl = new AbortController();

  const abort = (source: AbortSignal) => {
    if (!ctrl.signal.aborted) ctrl.abort(source.reason);
  };

  for (const s of signals) {
    if (s.aborted) {
      abort(s);
      break;
    }
    s.addEventListener('abort', () => abort(s), { once: true });
  }

  return ctrl.signal;
}

export function createSearchHandler(
  onSuccess: (data: unknown[]) => void = () => {},
  onError: (error: unknown) => void = () => {},
) {
  let currentController: AbortController | null = null;

  const performSearch = async (query: string) => {
    if (query.trim().length < 1) return;

    currentController?.abort(new DOMException('Aborted', 'AbortError'));
    currentController = new AbortController();
    const userSignal = currentController.signal;

    const signal = withTimeout(userSignal, TIMEOUT_MS);

    try {
      const data = await searchCountries(query, signal);
      onSuccess(data);
    } catch (error) {
      if (error instanceof DOMException || error instanceof Error) {
        if (error.name === 'AbortError') {
          return;
        }
        if (error.name === 'TimeoutError') {
          onError(new DOMException(`Request timed out (${TIMEOUT_MS} ms)`, 'TimeoutError'));
          return;
        }
      }
      onError(error);
    }
  };

  const debouncedSearch = debounce((query: string) => {
    performSearch(query);
  }, 300);

  return (query: string) => {
    currentController?.abort(new DOMException('Aborted', 'AbortError'));
    debouncedSearch(query);
  };
}