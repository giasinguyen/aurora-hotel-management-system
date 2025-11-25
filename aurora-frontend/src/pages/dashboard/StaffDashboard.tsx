import { Card, CardContent } from '@/components/ui/card';

const StaffDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-500 mt-2">Good morning! Here's your daily overview.</p>
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

export default StaffDashboard;