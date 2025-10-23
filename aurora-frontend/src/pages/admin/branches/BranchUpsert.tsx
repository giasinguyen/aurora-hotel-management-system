import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const BranchUpsertPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create/Edit Branch</h1>
        <p className="text-gray-500 mt-2">Add or update branch information</p>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center mb-4">Branch form will be implemented here</p>
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => navigate('/admin/branches')}>
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchUpsertPage;