import './styles/style.css';

import { createNavbar } from './app/components/navbar';
import { createSearch } from './app/components/search';
import { createFooter } from './app/components/footer';

const app = document.getElementById('app')!;

const navbar = createNavbar();
app.appendChild(navbar);

const searchSection = createSearch();
app.appendChild(searchSection);

const footer = createFooter();
app.appendChild(footer);