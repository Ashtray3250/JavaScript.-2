import '@babel/polyfill';
import 'whatwg-fetch';

import appMain from './js/script.js';
import './css/bootstrap.css';
import './css/st.css';

const app = new Vue(appMain);