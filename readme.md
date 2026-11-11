# Country search

# Skills

`JavaScript` | `TypeScript` | `fetch` | `Promise` | `async/await` | `AbortController` | `debounce` | `обработка ошибок` | `TDD` | `FIRST` | `Jest/Vitest` | `ESLint` | `Prettier` | `Husky`

# The essence of the task

The user types in a search field — the app sends GET `https://countries.dev/name/{query}` on every keystroke (no key, CORS-enabled). Results must be shown as the user types. The main pitfall is the stale-response race: the request for sp may respond later than the request for spain and overwrite the correct fresh result with an older one. The fix is not a "flag that ignores late responses" but genuine cancellation of the previous request via AbortController.