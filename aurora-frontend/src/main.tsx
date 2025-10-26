import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './features/store'
import { setupAxiosInterceptors } from './lib/axiosClient'
import './index.css'
import './config/i18n'
import App from './App.tsx'

// Setup axios interceptors with Redux store dispatch
setupAxiosInterceptors(store.dispatch);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
