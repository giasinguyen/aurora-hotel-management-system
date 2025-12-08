import {
  User,
  LogOut,
  LockKeyhole,
  LayoutDashboard,
  Hotel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout } from "@/features/slices/auth/authThunk";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface UserMenuProps {
  blackTheme?: boolean;
}

const UserMenu = ({ blackTheme }: UserMenuProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [avatarVersion, setAvatarVersion] = useState(Date.now());

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (user?.updatedAt) {
      setAvatarVersion(Date.now());
    }
  }, [user?.updatedAt]);

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  // Get profile path based on user role
  const getProfilePath = () => {
    if (user.roles?.includes("ADMIN")) return "/admin/profile";
    if (user.roles?.includes("MANAGER")) return "/manager/profile";
    if (user.roles?.includes("STAFF")) return "/staff/profile";
    return "/profile"; // Customer or guest
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`group flex h-auto items-center gap-3 px-3 py-2 transition-colors ${
            blackTheme ? "hover:bg-blue-300" : "hover:bg-orange-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-blue-100 transition-all group-hover:ring-orange-200">
              <AvatarImage
                src={
                  user.avatarUrl
                    ? `${user.avatarUrl}?v=${avatarVersion}`
                    : undefined
                }
                alt={fullName}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 p-2"
        sideOffset={5}
        alignOffset={-5}
      >
        {/* User Info Header */}
        <div className="mb-2 flex items-center gap-3 rounded-lg p-3">
          <Avatar className="h-12 w-12 ring-2 ring-white">
            <AvatarImage
              src={
                user.avatarUrl ? `${user.avatarUrl}?v=${avatarVersion}` : undefined
              }
              alt={fullName}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900">
              {fullName}
            </p>
            <p className="truncate text-sm text-gray-600">
              {user.email || "user@example.com"}
            </p>
            {user.roles && user.roles.length > 0 && (
              <Badge>{user.roles[0]}</Badge>
            )}
          </div>
        </div>

        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Role-specific dashboard links */}
        {user.roles && user.roles.includes("ADMIN") && (
          <DropdownMenuItem>
            <Link
              to={"/admin"}
              className="flex cursor-pointer items-center gap-3 rounded-lg"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <LayoutDashboard className="h-4 w-4 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium">Trang quản trị</p>
              </div>
            </Link>
          </DropdownMenuItem>
        )}

        {user.roles && user.roles.includes("MANAGER") && (
          <DropdownMenuItem>
            <Link
              to={"/manager"}
              className="flex cursor-pointer items-center gap-3 rounded-lg"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                <LayoutDashboard className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium">Trang quản lý</p>
              </div>
            </Link>
          </DropdownMenuItem>
        )}

        {user.roles && user.roles.includes("STAFF") && (
          <DropdownMenuItem>
            <Link
              to={"/staff"}
              className="flex cursor-pointer items-center gap-3 rounded-lg"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100">
                <LayoutDashboard className="h-4 w-4 text-cyan-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium">Trang nhân viên</p>
              </div>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem>
          <Link
            to={getProfilePath()}
            className="flex cursor-pointer items-center gap-3 rounded-lg"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium">Thông tin người dùng</p>
            </div>
          </Link>
        </DropdownMenuItem>

        {/* My Booking - Only for customers (not ADMIN, MANAGER, STAFF) */}
        {user.roles && 
         !user.roles.includes("ADMIN") && 
         !user.roles.includes("MANAGER") && 
         !user.roles.includes("STAFF") && (
          <DropdownMenuItem>
            <Link
              to={"/my-bookings"}
              className="flex cursor-pointer items-center gap-3 rounded-lg"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                <Hotel className="h-4 w-4 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium">My Booking</p>
              </div>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem>
          <Link
            to={"/sessions"}
            className="flex cursor-pointer items-center gap-3 rounded-lg"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <LockKeyhole className="h-4 w-4 text-gray-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium">Bảo mật</p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium">Đăng xuất</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
