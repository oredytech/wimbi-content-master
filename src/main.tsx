
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/firebase' // Importer Firebase au démarrage

createRoot(document.getElementById("root")!).render(<App />);
