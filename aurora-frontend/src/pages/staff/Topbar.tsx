import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import UserMenu from '@/pages/commons/UserMenu';

interface TopbarProps {
  className?: string;
}

export default function Topbar({ className }: TopbarProps) {
  return (
    <div className={`flex h-16 items-center justify-between border-b bg-white px-6 ${className}`}>
      {/* Search Bar */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search bookings, customers..."
            className="pl-10 pr-4"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-blue-600">
                5
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="text-sm font-medium">Check-in reminder</p>
                <p className="text-xs text-gray-500">Room 101 - Guest arriving in 30 minutes</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="text-sm font-medium">Late checkout request</p>
                <p className="text-xs text-gray-500">Room 205 - Requested extension until 2 PM</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="text-sm font-medium">Issue report</p>
                <p className="text-xs text-gray-500">Room 303 - Air conditioning not working</p>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <UserMenu blackTheme={true} />
      </div>
    </div>
  );
}
