import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Home from './modules/Home/Home';
import './app.global.css';

render(
    <AppContainer>
        <Home />
    </AppContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./modules/Home/Home', () => {
        // eslint-disable-next-line global-require
        const NextRoot = require('./modules/Home/Home').default;
        render(
            <AppContainer>
                <NextRoot />
            </AppContainer>,
            document.getElementById('root')
        );
    });
}
