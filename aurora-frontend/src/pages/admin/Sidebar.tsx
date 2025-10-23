import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Hotel,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { APP_COLOR } from '@/utils/constant';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    title: 'Branches',
    icon: Building2,
    href: '/admin/branches',
  },
  {
    title: 'Users',
    icon: Users,
    href: '/admin/users',
    children: [
      { title: 'User List', href: '/admin/users' },
      { title: 'Role Management', href: '/admin/roles' },
    ],
  },
  {
    title: 'Documents',
    icon: FileText,
    href: '/admin/documents',
  },
  {
    title: 'Reports',
    icon: BarChart3,
    href: '/admin/reports',
    children: [
      { title: 'Overview', href: '/admin/reports/overview' },
      { title: 'Revenue', href: '/admin/reports/revenue' },
      { title: 'Occupancy', href: '/admin/reports/occupancy' },
      { title: 'Branch Comparison', href: '/admin/reports/branch-comparison' },
    ],
  },
];

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  return (
    <div
      className={cn(
        'relative h-screen border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
      style={{ backgroundColor: `${APP_COLOR.ADMIN}10` }} // Very light red background (10% opacity)
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <Hotel className="h-6 w-6" style={{ color: APP_COLOR.ADMIN }} />
            <span className="font-bold text-lg" style={{ color: APP_COLOR.ADMIN }}>Aurora Admin</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/admin" className="flex items-center justify-center w-full">
            <Hotel className="h-6 w-6" style={{ color: APP_COLOR.ADMIN }} />
          </Link>
        )}
      </div>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border bg-white shadow-md hover:bg-gray-100"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Menu Items */}
      <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const isExpanded = expandedItems.includes(item.title);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.title}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'text-white'
                      : 'text-gray-700',
                    collapsed && 'justify-center px-2'
                  )}
                  style={{
                    backgroundColor: isActive ? APP_COLOR.ADMIN : 'transparent',
                    color: isActive ? '#ffffff' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = `${APP_COLOR.ADMIN}20`;
                      e.currentTarget.style.color = APP_COLOR.ADMIN;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#374151'; // text-gray-700
                    }
                  }}
                  onClick={(e) => {
                    if (hasChildren && !collapsed) {
                      e.preventDefault();
                      toggleExpand(item.title);
                    }
                  }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="flex-1">{item.title}</span>}
                  {!collapsed && hasChildren && (
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-90'
                      )}
                    />
                  )}
                </Link>

                {/* Sub Menu */}
                {!collapsed && hasChildren && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 pl-4" style={{ borderColor: `${APP_COLOR.ADMIN}40` }}>
                    {item.children?.map((child) => {
                      const isChildActive = location.pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={cn(
                            'block rounded-lg px-3 py-2 text-sm transition-all',
                            isChildActive
                              ? 'font-medium'
                              : 'text-gray-600'
                          )}
                          style={{
                            backgroundColor: isChildActive ? `${APP_COLOR.ADMIN}20` : 'transparent',
                            color: isChildActive ? APP_COLOR.ADMIN : undefined,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${APP_COLOR.ADMIN}20`;
                            e.currentTarget.style.color = APP_COLOR.ADMIN;
                          }}
                          onMouseLeave={(e) => {
                            if (!isChildActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#4B5563'; // text-gray-600
                            }
                          }}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Separator className="my-4" />

        {/* Quick Actions */}
        {!collapsed && (
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold text-gray-500">QUICK ACTIONS</p>
            <Link
              to="/admin/checkinout"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${APP_COLOR.ADMIN}20`;
                e.currentTarget.style.color = APP_COLOR.ADMIN;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#374151';
              }}
            >
              <LogIn className="h-5 w-5" />
              <span>Check-in / Check-out</span>
            </Link>
          </div>
        )}

        <Separator className="my-4" />

        {/* Footer Info */}
        {!collapsed && (
          <div className="rounded-lg p-3" style={{ backgroundColor: `${APP_COLOR.ADMIN}20` }}>
            <p className="text-xs font-medium" style={{ color: APP_COLOR.ADMIN }}>Admin Panel</p>
            <p className="text-xs" style={{ color: `${APP_COLOR.ADMIN}cc` }}>Manage your hotel system</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
