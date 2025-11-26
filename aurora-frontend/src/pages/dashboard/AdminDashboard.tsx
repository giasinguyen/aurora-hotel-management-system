import { Card, CardContent } from '@/components/ui/card';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your hotels.</p>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">Dashboard content will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;