import type { CountryCardData } from '../../logic/mapCountryResponse';

export interface CountryModalUI {
  element: HTMLElement;
  open: (country: CountryCardData) => void;
  close: () => void;
}

export function createCountryModal(onClose: () => void): CountryModalUI {
  const modal = document.createElement('div');
  modal.className = 'modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal__content';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal__close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Close modal');

  const header = document.createElement('div');
  header.className = 'modal__header';

  const flagImg = document.createElement('img');
  flagImg.className = 'modal__flag';
  flagImg.loading = 'lazy';

  const title = document.createElement('h2');
  title.className = 'modal__title';

  header.appendChild(flagImg);
  header.appendChild(title);

  const info = document.createElement('div');
  info.className = 'modal__info';

  const createRow = (label: string, value: string): HTMLElement => {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    return p;
  };

  const renderData = (country: CountryCardData) => {
    title.textContent = country.name;
    flagImg.src = country.flag;
    flagImg.alt = `Flag ${country.name}`;

    info.replaceChildren();

    info.appendChild(createRow('Capital', country.capital));
    info.appendChild(createRow('Region', country.region));
    info.appendChild(createRow('Population', country.population.toLocaleString('ru-RU')));
    info.appendChild(createRow('Languages', country.languages));
    info.appendChild(createRow('Area', country.area));
    info.appendChild(createRow('Borders', country.borders));
    info.appendChild(createRow('Currency', country.currency));
  };

  const closeModal = () => {
    modal.classList.remove('modal--open');
    document.body.classList.remove('no-scroll');
    onClose();
  };

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  modalContent.append(closeBtn, header, info);
  modal.appendChild(modalContent);

  return {
    element: modal,
    open: (country: CountryCardData) => {
      renderData(country);
      modal.classList.add('modal--open');
      document.body.classList.add('no-scroll');
    },
    close: closeModal,
  };
}