import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const ManagerDashboard = () => {
  const navigate = useNavigate();

  // Temporary solution: Redirect to bookings page
  useEffect(() => {
    navigate('/manager/bookings', { replace: true });
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-500 mt-2">Redirecting to bookings...</p>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">Redirecting to bookings page...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
