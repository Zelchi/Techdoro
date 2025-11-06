import { createRoot } from 'react-dom/client';
import Context from './app/Container-Context';
import App from './app/App';
import './index.css'

const root = createRoot(document.body);
root.render(
    <Context>
        <App />
    </Context>
);