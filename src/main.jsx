import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router' 
import App from './App.jsx'
import { UserProvider } from './contexts/UserContext'
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)