import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAppSelector } from '@/hooks/useRedux';

const AdminPage = () => {
  const { isLogin, user } = useAppSelector((state) => state.auth);

  // Redirect to auth page if not logged in
  if (!isLogin) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // Check if user has admin role
  const isAdmin = user?.roles?.includes('ADMIN');
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;