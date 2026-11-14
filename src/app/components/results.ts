import { createSpinner } from './spinner';

export type ResultsState = 'idle' | 'loading' | 'empty' | 'error';

export interface ResultsUI {
  element: HTMLElement;
  setState: (state: ResultsState, payload?: unknown) => void;
}

export function createResults(errorImageSrc: string): ResultsUI {
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results';

  const createStateImage = (): HTMLImageElement => {
    const img = document.createElement('img');
    img.src = errorImageSrc;
    img.alt = 'Error or not found';
    img.className = 'state-image';
    return img;
  };

  const renderEmpty = (): void => {
    const empty = document.createElement('div');
    empty.className = 'empty-state';

    const img = createStateImage();
    const text = document.createElement('p');
    text.textContent = 'No countries found. Try a different query.';

    empty.appendChild(img);
    empty.appendChild(text);
    resultsContainer.appendChild(empty);
  };

  const renderError = (payload?: unknown): void => {
    const errorBox = document.createElement('div');
    errorBox.className = 'error-box';

    const img = createStateImage();
    const errorText = document.createElement('p');
    errorText.className = 'error-box__title';
    errorText.textContent = '404';

    const retryBtn = document.createElement('button');
    retryBtn.className = 'retry-btn';
    retryBtn.textContent = 'Retry';

    if (typeof payload === 'function') {
      retryBtn.addEventListener('click', payload as () => void);
    }

    errorBox.appendChild(img);
    errorBox.appendChild(errorText);
    errorBox.appendChild(retryBtn);
    resultsContainer.appendChild(errorBox);
  };

  const setState = (state: ResultsState, payload?: unknown): void => {
    resultsContainer.replaceChildren();

    switch (state) {
      case 'idle':
        return;
      case 'loading':
        resultsContainer.appendChild(createSpinner());
        return;
      case 'empty':
        renderEmpty();
        return;
      case 'error':
        renderError(payload);
        return;
    }
  };

  return {
    element: resultsContainer,
    setState,
  };
}