import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import clarity from '@microsoft/clarity'
import './index.css'
import './styles/cyberpunk.css'
import App from './App.jsx'

const projectId = "wx29m0zkf2"
clarity.init(projectId)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
