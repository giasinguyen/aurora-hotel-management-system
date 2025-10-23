import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

export default function UserMenu({
  userName = 'User',
  userEmail = 'user@aurora.com',
  userAvatar,
  onLogout,
}: UserMenuProps) {
  const location = useLocation();
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Xác định role từ URL để link đúng trang profile
  const getProfileLink = () => {
    const pathParts = location.pathname.split('/');
    const role = pathParts[1]; // staff, manager, admin, hoặc customer
    
    if (['staff', 'manager', 'admin'].includes(role)) {
      return `/${role}/profile`;
    }
    return '/customer/profile'; // fallback cho customer
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={getProfileLink()}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => {
            if (onLogout) {
              onLogout();
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
