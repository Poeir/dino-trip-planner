import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import HomepageApp from './pages/homepagePage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HomepageApp />
  </StrictMode>,
)
