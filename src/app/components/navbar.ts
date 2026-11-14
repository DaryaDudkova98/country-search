import '../../styles/components/navbar.css';

import logoImage from '../../img/icon-logo.png';
import themeLight from '../../img/sun.svg?raw';
import themeDark from '../../img/basil--moon-solid.svg?raw';

const THEME_KEY = 'country-search-theme';

export function createNavbar(): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'navbar';

  const logoBlock = document.createElement('div');
  logoBlock.className = 'navbar__logo';

  const logo = document.createElement('div');
  logo.className = 'navbar__logo-wrapper';

  const logoImg = document.createElement('img');
  logoImg.className = 'navbar__logo-img';
  logoImg.src = logoImage;
  logoImg.alt = 'Country search logo';

  const logoBG = document.createElement('div');
  logoBG.className = 'navbar__logo-bg';

  logo.appendChild(logoBG);
  logo.appendChild(logoImg);

  const logoText = document.createElement('span');
  logoText.className = 'navbar__logo-text';
  logoText.textContent = 'Country Search';

  logoBlock.appendChild(logo);
  logoBlock.appendChild(logoText);

  const listButtons = document.createElement('div');
  listButtons.className = 'navbar__buttons';

  const btnTheme = document.createElement('button');
  btnTheme.className = 'navbar__button navbar__buttons-theme';
  btnTheme.type = 'button';
  btnTheme.setAttribute('aria-label', 'Toggle theme');

  const isDark = (): boolean => document.documentElement.classList.contains('Dark');

  const updateThemeIcon = (): void => {
    const iconSvg = isDark() ? themeLight : themeDark;
    btnTheme.replaceChildren();
    btnTheme.insertAdjacentHTML('beforeend', iconSvg);

    const svg = btnTheme.querySelector('svg');
    if (svg) svg.classList.add('navbar__icon');
  };

  const applyTheme = (dark: boolean): void => {
    document.documentElement.classList.toggle('Dark', dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    updateThemeIcon();
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  const startDark = savedTheme === 'dark';
  document.documentElement.classList.toggle('Dark', startDark);
  updateThemeIcon();

  btnTheme.addEventListener('click', () => {
    applyTheme(!isDark());
  });

  listButtons.appendChild(btnTheme);

  nav.appendChild(logoBlock);
  nav.appendChild(listButtons);

  return nav;
}