import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/store';
import App from './App';
//
// axios.defaults.withCredentials = true;

const root = document.getElementById('root');

createRoot(root).render(
    <Provider store={store}>
        {/*<React.StrictMode>*/}
        <BrowserRouter>
            <App/>
        </BrowserRouter>
        {/*</React.StrictMode>*/}
    </Provider>
);