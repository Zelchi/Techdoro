import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import Context from './app/Context';
import App from './app/App';
import './index.css'

const root = createRoot(document.body);
root.render(
    <StrictMode>
        <Context>
            <App />
        </Context>
    </StrictMode>
);