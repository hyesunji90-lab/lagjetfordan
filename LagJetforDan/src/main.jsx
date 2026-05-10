import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import DemoPasswordGate from './components/DemoPasswordGate.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoPasswordGate>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DemoPasswordGate>
  </StrictMode>,
)
