import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const BranchList = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branches</h1>
          <p className="text-gray-500 mt-2">Manage all hotel branches</p>
        </div>
        <Link to="/admin/branches/upsert">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </Link>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">Branch list will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchList;