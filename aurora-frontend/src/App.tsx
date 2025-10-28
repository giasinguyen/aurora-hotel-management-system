import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchCurrentUserAsync, clearAuth, selectIsAuthenticated, selectCurrentUser } from '@/features/slices/auth/authSlice';
import { getRedirectPathByRole } from '@/utils/roleHelper';
import router from './router';

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);

  // Fetch user info when app loads if authenticated
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated && !currentUser) {
        try {
          const user = await dispatch(fetchCurrentUserAsync()).unwrap();
          
          // Redirect to appropriate dashboard based on role if on login/register page
          const currentPath = window.location.pathname;
          if (currentPath === '/login' || currentPath === '/register') {
            const redirectPath = getRedirectPathByRole(user);
            window.location.href = redirectPath;
          }
        } catch {
          dispatch(clearAuth());
        }
      }
    };

    initAuth();
  }, [dispatch, isAuthenticated, currentUser]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
