import { debounce } from './debounce';
import { searchCountries } from './searchCountries';

export function createSearchHandler(
  onSuccess: (data: any[]) => void = () => {},
  onError: (error: unknown) => void = () => {},
) {
  let controller: AbortController | null = null;
  const TIMEOUT_MS = 5000;

  const searchFn = async (query: string) => {
    controller = new AbortController();
    const currentController = controller;

    const timeoutId = setTimeout(() => {
      currentController.abort(new DOMException('Timeout', 'TimeoutError'));
    }, TIMEOUT_MS);

    try {
      const data = await searchCountries(query, currentController.signal);
      onSuccess(data);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        onError(error);
        return;
      }

      onError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const debouncedSearch = debounce(searchFn as any, 300);

  return (query: string) => {
    if (controller) {
      controller.abort(new DOMException('Aborted', 'AbortError'));
    }
    debouncedSearch(query);
  };
}