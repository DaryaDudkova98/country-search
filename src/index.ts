import './styles/style.css';
import { createNavbar } from './app/components/navbar';
import { createSearch } from './app/components/search';
import { createFooter } from './app/components/footer';
import { createSearchHandler } from './logic/searchInput';
import { createCountryCard } from './app/components/countryCard';
import {
  mapCountryResponse,
  type RawCountryResponse,
  type CountryCardData,
} from './logic/mapCountryResponse';
import { createCountryModal } from './app/components/countryModal';

const app = document.getElementById('app')!;

app.appendChild(createNavbar());

const countryModal = createCountryModal(() => {});
app.appendChild(countryModal.element);

const searchUI = createSearch();
app.appendChild(searchUI.element);

let lastQuery = '';

const retrySearch = () => {
  if (lastQuery) {
    searchUI.setState('loading');
    handleSearch(lastQuery);
  }
};

const handleSearch = createSearchHandler(
  (data: unknown[]) => {
    const countries = data as RawCountryResponse[];
    if (countries.length === 0) {
      searchUI.setState('empty');
      return;
    }

    searchUI.resultsContainer.replaceChildren();

    countries.forEach((rawCountry) => {
      const mappedCountry = mapCountryResponse(rawCountry);

      const card = createCountryCard(mappedCountry, (clickedCountry: CountryCardData) => {
        countryModal.open(clickedCountry);
      });

      searchUI.resultsContainer.appendChild(card);
    });
  },
  (error) => {
    console.error(error);
    searchUI.setState('error', retrySearch);
  }
);

searchUI.input.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  lastQuery = target.value;

  if (lastQuery.trim().length === 0) {
    searchUI.setState('idle');
    handleSearch('');
  } else {
    searchUI.setState('loading');
    handleSearch(lastQuery);
  }
});

searchUI.goButton.addEventListener('click', () => {
  lastQuery = searchUI.input.value;
  if (lastQuery.trim().length > 0) {
    searchUI.setState('loading');
    handleSearch(lastQuery);
  }
});

app.appendChild(createFooter());
