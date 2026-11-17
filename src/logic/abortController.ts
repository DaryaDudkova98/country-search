export function createAbortController() {
  let currentController: AbortController | null = null;

  return {
    getSignal(): AbortSignal {
      if (currentController) {
        currentController.abort();
      }
      currentController = new AbortController();
      return currentController.signal;
    },

    clear(): void {
      if (currentController) {
        currentController.abort();
        currentController = null;
      }
    },
  };
}
