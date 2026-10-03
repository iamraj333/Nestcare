import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ContextAPIProvider } from './context/ContextData.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextAPIProvider>
      <App />
    </ContextAPIProvider>
  </StrictMode>
)
