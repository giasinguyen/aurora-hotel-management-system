import { Card, CardContent } from '@/components/ui/card';

const ManagerDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage your branch operations efficiently.</p>
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

export default ManagerDashboard;
