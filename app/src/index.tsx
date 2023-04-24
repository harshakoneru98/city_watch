import ReactDOM from 'react-dom/client';
import App from './App';
import { StyledEngineProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StyledEngineProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </StyledEngineProvider>
);
