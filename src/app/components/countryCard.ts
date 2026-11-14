import type { CountryCardData } from '../../logic/mapCountryResponse';

export function createCountryCard(
  country: CountryCardData,
  onClick: (country: CountryCardData) => void
): HTMLElement {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'country-card';

  card.addEventListener('click', () => onClick(country));

  const flagWrapper = document.createElement('div');
  flagWrapper.className = 'country-card__flag-wrapper';

  const flag = document.createElement('img');
  flag.src = country.flag;
  flag.alt = `Flag ${country.name}`;
  flag.className = 'country-card__flag';
  flag.loading = 'lazy';

  flagWrapper.appendChild(flag);

  const info = document.createElement('div');
  info.className = 'country-card__info';

  const name = document.createElement('h3');
  name.className = 'country-card__name';
  name.textContent = country.name;

  const contentBlock = document.createElement('div');
  contentBlock.className = 'country-card__content';

  const capital = document.createElement('p');
  capital.className = 'country-card__capital';
  capital.textContent = country.capital !== 'N/A' ? `Capital: ${country.capital}` : 'Capital: —';

  const region = document.createElement('p');
  region.className = 'country-card__region';
  region.textContent = `Region: ${country.region}`;

  const population = document.createElement('p');
  population.className = 'country-card__population';
  population.textContent = `Population: ${country.population.toLocaleString('ru-RU')}`;

  contentBlock.appendChild(capital);
  contentBlock.appendChild(region);
  contentBlock.appendChild(population);

  info.appendChild(name);
  info.appendChild(contentBlock);

  card.appendChild(flagWrapper);
  card.appendChild(info);

  return card;
}