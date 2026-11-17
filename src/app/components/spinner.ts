export function createSpinner(): HTMLElement {
  const loader = document.createElement('div');
  loader.className = 'loader';

  const spinner = document.createElement('div');
  spinner.className = 'loader__spinner';

  loader.appendChild(spinner);
  return loader;
}
