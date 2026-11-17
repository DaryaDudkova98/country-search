import { HttpError } from './HttpError';
import type { RawCountryResponse } from './mapCountryResponse';

const cache = new Map<string, RawCountryResponse[]>();

interface PendingRequest {
  promise: Promise<RawCountryResponse[]>;
  controller: AbortController;
  subscribersCount: number;
}

const pendingRequests = new Map<string, PendingRequest>();

export async function searchCountries(
  query: string,
  signal: AbortSignal
): Promise<RawCountryResponse[]> {
  const normalizedQuery = query.trim().toLowerCase();

  if (cache.has(normalizedQuery)) {
    return cache.get(normalizedQuery)!;
  }

  let pending = pendingRequests.get(normalizedQuery);

  if (!pending) {
    const controller = new AbortController();
    const url = `https://countries.dev/name/${encodeURIComponent(normalizedQuery)}?fields=name,capital,population,flags,languages,region,area,borders,currencies`;

    const promise = fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 404) {
            return [];
          }
          throw new HttpError(response.status);
        }
        const data = (await response.json()) as RawCountryResponse[];

        cache.set(normalizedQuery, data);
        return data;
      })
      .finally(() => {
        pendingRequests.delete(normalizedQuery);
      });

    pending = { promise, controller, subscribersCount: 0 };
    pendingRequests.set(normalizedQuery, pending);
  }

  pending.subscribersCount++;
  const currentPending = pending;

  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      currentPending.subscribersCount--;
      if (currentPending.subscribersCount === 0) {
        currentPending.controller.abort();
      }
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const onAbort = () => {
      currentPending.subscribersCount--;

      if (currentPending.subscribersCount === 0) {
        currentPending.controller.abort();
      }

      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal.addEventListener('abort', onAbort, { once: true });

    currentPending.promise
      .then((data) => {
        signal.removeEventListener('abort', onAbort);
        resolve(data);
      })
      .catch((error) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      });
  });
}
