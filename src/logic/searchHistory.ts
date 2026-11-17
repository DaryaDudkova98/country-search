const STORAGE_KEY = 'search-history';
const MAX_HISTORY_ITEMS = 7;

export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addSearchToHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;

  const history = getSearchHistory();

  const filtered = history.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());

  const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
