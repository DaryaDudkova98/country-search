import { debounce } from './debounce';
import { searchCountries } from './searchCountries';

export function createSearchHandler(
  onSuccess: (data: any[]) => void = () => {},
  onError: (error: unknown) => void = () => {},
) {
  let controller: AbortController | null = null;

  const searchFn = async (query: string) => {
    controller = new AbortController();
    
    try {
      const data = await searchCountries(query, controller.signal);
      onSuccess(data);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      onError(error);
    }
  };

  const debouncedSearch = debounce(searchFn as any, 300);

  return (query: string) => {
    if (controller) {
      controller.abort();
    }
    debouncedSearch(query);
  };
}