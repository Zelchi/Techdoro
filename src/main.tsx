import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import './main.css';
import App from './App.tsx';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Pomodoro } from './components/Pomodoro';
import { Tarefas } from './components/Tarefas';
import { BarraJanela } from './components/BarraJanela.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/clock" element={<><BarraJanela /><Pomodoro /></>} />
        <Route path="/tasks" element={<><BarraJanela /><Tarefas /></>} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  </Provider>
);