import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const UserList = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-2">Manage system users</p>
        </div>
        <Link to="/admin/users/upsert">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">User list will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserList;