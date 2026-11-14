import './styles/style.css';

import { createNavbar } from './app/components/navbar';
import { createFooter } from './app/components/footer';

const app = document.getElementById('app')!;

const navbar = createNavbar();
app.appendChild(navbar);

const footer = createFooter();
app.appendChild(footer);