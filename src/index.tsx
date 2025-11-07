import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from './app/store/store';
import App from './app/App';
import './index.css'
import styled from 'styled-components';

const Background = styled.div`
    position: fixed;
    inset: 0;
    pointer-events: none;

    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    background: rgba(10, 10, 10, 0.9);
    backdrop-filter: blur(14px) saturate(180%);
    -webkit-backdrop-filter: blur(14px) saturate(180%);
    z-index: -100;
`;

const root = createRoot(document.body);
root.render(
    <StrictMode>
        <Provider store={store} >
            <Background />
            <App />
        </Provider>
    </StrictMode>
);