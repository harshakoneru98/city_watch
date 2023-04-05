import ReactDOM from 'react-dom/client'
import App from './App'
import { StyledEngineProvider } from '@mui/material/styles';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StyledEngineProvider>
    <App />
  </StyledEngineProvider>,
)
