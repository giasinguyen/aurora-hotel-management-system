import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from '@/features/store';
import { setupAxiosInterceptors } from '@/config/axiosClient';
import { Toaster } from '@/components/ui/sonner';
import { PersistGate } from 'redux-persist/integration/react';
import router from './router';

// Setup axios interceptors
setupAxiosInterceptors(store.dispatch);

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster />
      </PersistGate>
    </Provider>
  );
}

export default App;
