export function createSearch(): HTMLElement {
  const main = document.createElement('main');
  main.className = 'main';

  const container = document.createElement('div');
  container.className = 'search-container';

  const sbWrapper = document.createElement('div');
  sbWrapper.className = 'sb-33';

  const panel = document.createElement('div');
  panel.className = 'sb-33__panel';

  const label = document.createElement('p');
  label.className = 'sb-33__label';
  label.id = 'sb-33-label';
  label.textContent = 'Country search';

  const row = document.createElement('div');
  row.className = 'sb-33__row';
  row.setAttribute('role', 'search');

  const field = document.createElement('div');
  field.className = 'sb-33__field';

  const svgNS = 'http://www.w3.org/2000/svg';
  const searchIcon = document.createElementNS(svgNS, 'svg');
  searchIcon.setAttribute('class', 'sb-33__ico');
  searchIcon.setAttribute('viewBox', '0 0 24 24');
  searchIcon.setAttribute('fill', 'none');
  searchIcon.setAttribute('aria-hidden', 'true');
  searchIcon.setAttribute('focusable', 'false');

  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', '11');
  circle.setAttribute('cy', '11');
  circle.setAttribute('r', '6.4');
  circle.setAttribute('stroke', 'currentColor');
  circle.setAttribute('stroke-width', '1.9');

  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'm16 16 4.2 4.2');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.9');
  path.setAttribute('stroke-linecap', 'round');

  searchIcon.appendChild(circle);
  searchIcon.appendChild(path);

  const hiddenLabel = document.createElement('label');
  hiddenLabel.className = 'sb-33__vh';
  hiddenLabel.htmlFor = 'search-input';
  hiddenLabel.textContent = 'Search countries';

  const input = document.createElement('input');
  input.className = 'sb-33__input';
  input.id = 'search-input';
  input.type = 'search';
  input.placeholder = 'Search countries...';
  input.autocomplete = 'off';

  field.appendChild(searchIcon);
  field.appendChild(hiddenLabel);
  field.appendChild(input);

  const goBtn = document.createElement('button');
  goBtn.className = 'sb-33__go';
  goBtn.type = 'button';
  goBtn.setAttribute('aria-label', 'Search');

  const arrowIcon = document.createElementNS(svgNS, 'svg');
  arrowIcon.setAttribute('viewBox', '0 0 24 24');
  arrowIcon.setAttribute('fill', 'none');
  arrowIcon.setAttribute('aria-hidden', 'true');
  arrowIcon.setAttribute('focusable', 'false');

  const arrowPath = document.createElementNS(svgNS, 'path');
  arrowPath.setAttribute('d', 'M5 12h13m-5.5-5.5L18 12l-5.5 5.5');
  arrowPath.setAttribute('stroke', 'currentColor');
  arrowPath.setAttribute('stroke-width', '2.1');
  arrowPath.setAttribute('stroke-linecap', 'round');
  arrowPath.setAttribute('stroke-linejoin', 'round');

  arrowIcon.appendChild(arrowPath);
  goBtn.appendChild(arrowIcon);

  row.appendChild(field);
  row.appendChild(goBtn);

  panel.appendChild(label);
  panel.appendChild(row);

  sbWrapper.appendChild(panel);
  container.appendChild(sbWrapper);
  main.appendChild(container);

  return main;
}