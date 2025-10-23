import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, LogIn } from 'lucide-react';

interface RequireCheckInProps {
  children: React.ReactNode;
  role: 'staff' | 'manager' | 'admin';
}

const RequireCheckIn = ({ children, role }: RequireCheckInProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Các route được phép truy cập mà không cần check-in
  const allowedRoutesWithoutCheckIn = [
    `/${role}/checkinout`,
    `/${role}`, // Dashboard để xem thông báo
  ];

  useEffect(() => {
    // Kiểm tra trạng thái check-in từ localStorage hoặc API
    const checkInStatus = localStorage.getItem(`${role}_checkin_status`);
    const checkInTime = localStorage.getItem(`${role}_checkin_time`);
    
    // Kiểm tra xem có phải cùng ngày không
    if (checkInStatus === 'checked_in' && checkInTime) {
      const today = new Date().toDateString();
      const checkedInDate = new Date(checkInTime).toDateString();
      
      if (today === checkedInDate) {
        setIsCheckedIn(true);
      } else {
        // Nếu khác ngày, xóa trạng thái cũ
        localStorage.removeItem(`${role}_checkin_status`);
        localStorage.removeItem(`${role}_checkin_time`);
        setIsCheckedIn(false);
      }
    }
    
    setLoading(false);
  }, [role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Nếu đã check-in hoặc đang ở route được phép, hiển thị nội dung
  if (isCheckedIn || allowedRoutesWithoutCheckIn.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Nếu chưa check-in, hiển thị màn hình yêu cầu check-in
  const getRoleLabel = () => {
    switch (role) {
      case 'staff':
        return 'Staff';
      case 'manager':
        return 'Manager';
      case 'admin':
        return 'Admin';
      default:
        return '';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'staff':
        return 'bg-blue-50 border-blue-200';
      case 'manager':
        return 'bg-indigo-50 border-indigo-200';
      case 'admin':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className={`w-full max-w-md ${getRoleColor()} border-2`}>
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Check-in Required</CardTitle>
            <Badge variant="outline" className="mt-2">
              {getRoleLabel()} Panel
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              You need to check-in before accessing the system.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate(`/${role}/checkinout`)}
              className="w-full"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Go to Check-in Page
            </Button>
            
            <p className="text-xs text-center text-gray-500">
              After check-in, you can access all features of the system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequireCheckIn;
