import { Outlet } from 'react-router-dom';
import ClientHeader from './components/ClientHeader';
import ClientFooter from './components/ClientFooter';

export default function RootPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      <main className="flex-1 pt-28 lg:pt-32">
        <Outlet />
      </main>
      <ClientFooter />
    </div>
  );
}
