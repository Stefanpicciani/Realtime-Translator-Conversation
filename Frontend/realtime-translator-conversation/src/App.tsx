
import { TranslationProvider } from './contexts/TranslationContext';
import TranslationPanel from './components/TranslationPanel';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <div className="app">
      <TranslationProvider>
        <Header />
        <main className="app-content">
          <TranslationPanel />
        </main>
        <footer className="app-footer">
          <p>Tradutor em Tempo Real &copy; {new Date().getFullYear()}</p>
        </footer>
      </TranslationProvider>
    </div>
  );
}

export default App;