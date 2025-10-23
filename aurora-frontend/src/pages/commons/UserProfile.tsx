import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const UserProfile = () => {
  const location = useLocation();
  
  // Xác định role từ URL
  const role = location.pathname.split('/')[1] as 'staff' | 'manager' | 'admin';

  const getRoleLabel = () => {
    switch (role) {
      case 'staff': return 'Staff';
      case 'manager': return 'Manager';
      case 'admin': return 'Admin';
      default: return '';
    }
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'staff': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'manager': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-2">Manage your personal information and account settings</p>
        </div>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500" />
              </Avatar>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">Staff User</h2>
                <Badge className={getRoleBadgeColor()}>
                  <Shield className="w-3 h-3 mr-1" />
                  {getRoleLabel()}
                </Badge>
              </div>

              <div className="w-full pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>staff@aurora.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined Oct 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-sm text-gray-900">Staff User</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Employee ID</label>
                <p className="text-sm text-gray-900">EMP-2024-001</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <p className="text-sm text-gray-900">staff@aurora.com</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <p className="text-sm text-gray-900">+84 123 456 789</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Department</label>
                <p className="text-sm text-gray-900">Front Desk</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Position</label>
                <p className="text-sm text-gray-900">{getRoleLabel()}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <p className="text-sm text-gray-900">123 Main Street, District 1, Ho Chi Minh City, Vietnam</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Work Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Branch</label>
                  <p className="text-sm text-gray-900">Aurora Hotel - Main Branch</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Work Schedule</label>
                  <p className="text-sm text-gray-900">Mon - Fri, 9:00 AM - 6:00 PM</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Manager</label>
                  <p className="text-sm text-gray-900">John Doe</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Employment Status</label>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Account settings and preferences will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
