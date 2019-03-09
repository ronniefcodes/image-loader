import './index.css';
import config from './config';
import * as serviceWorker from './serviceWorker';
import renderApp from './utils/run';

renderApp(config, 'root');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
