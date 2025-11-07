import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from './app/store/store';
import App from './app/App';
import './index.css'

const root = createRoot(document.body);
root.render(
    <StrictMode>
        <Provider store={store} >
            <App />
        </Provider>
    </StrictMode>
);