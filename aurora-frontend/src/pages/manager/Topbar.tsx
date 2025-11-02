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
            placeholder="Search rooms, services, staff..."
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
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-orange-600">
                4
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="text-sm font-medium">Low occupancy alert</p>
                <p className="text-xs text-gray-500">Only 45% rooms occupied this week</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="text-sm font-medium">Staff leave request</p>
                <p className="text-xs text-gray-500">John Doe requested leave for tomorrow</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                <p className="text-sm font-medium">Promotion ending soon</p>
                <p className="text-xs text-gray-500">Summer promotion ends in 3 days</p>
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
