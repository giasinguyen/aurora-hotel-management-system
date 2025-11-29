import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  AlertTriangle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

import type { User } from '@/types/user.types';
import { ROLE_CONFIG } from '@/types/user.types';

interface UserDetailCardProps {
  user: User;
}

export default function UserDetailCard({ user }: UserDetailCardProps) {
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPrimaryRole = () => {
    if (!user.roles || user.roles.length === 0) return null;
    // Priority: ADMIN > MANAGER > STAFF > CUSTOMER
    const priority = ['ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER'];
    for (const roleName of priority) {
      const role = user.roles.find(r => r.name === roleName);
      if (role) return role;
    }
    return user.roles[0];
  };

  const primaryRole = getPrimaryRole();
  const primaryRoleName = primaryRole?.name || '';

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className={`h-32 bg-gradient-to-r ${
          primaryRoleName === 'ADMIN' ? 'from-red-600 via-red-500 to-orange-500' :
          primaryRoleName === 'MANAGER' ? 'from-blue-600 via-blue-500 to-cyan-500' :
          primaryRoleName === 'STAFF' ? 'from-emerald-600 via-emerald-500 to-teal-500' :
          'from-gray-600 via-gray-500 to-slate-500'
        }`} />
        <CardContent className="relative pb-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info Header */}
          <div className="pt-20 pl-2">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <UserIcon className="h-4 w-4" />
                  @{user.username}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {/* Account Status */}
                <Badge 
                  variant={user.active ? 'default' : 'destructive'}
                  className={`flex items-center gap-1 ${
                    user.active 
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.active ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Đang hoạt động
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      Đã vô hiệu hóa
                    </>
                  )}
                </Badge>

                {/* Email Verified */}
                {user.emailVerified !== undefined && (
                  <Badge 
                    variant="outline"
                    className={`flex items-center gap-1 ${
                      user.emailVerified 
                        ? 'border-blue-300 text-blue-700 bg-blue-50' 
                        : 'border-amber-300 text-amber-700 bg-amber-50'
                    }`}
                  >
                    {user.emailVerified ? (
                      <>
                        <Mail className="h-3 w-3" />
                        Email đã xác thực
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        Chưa xác thực email
                      </>
                    )}
                  </Badge>
                )}

                {/* Locked Status - removed as lockedUntil is not in User type */}
              </div>
            </div>

            {/* Role Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {user.roles?.map((role) => {
                const config = ROLE_CONFIG[role.name];
                return (
                  <Badge
                    key={role.id}
                    className={`flex items-center gap-1 ${config?.bgColor || 'bg-gray-100'} ${config?.color || 'text-gray-700'} border-0`}
                  >
                    <Shield className="h-3 w-3" />
                    {config?.label || role.name}
                  </Badge>
                );
              })}
              {(!user.roles || user.roles.length === 0) && (
                <Badge variant="outline" className="text-muted-foreground">
                  Chưa phân quyền
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }} className="text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
                <CardDescription className="text-blue-100">
                  Email, điện thoại và địa chỉ
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                <p className="font-medium">{user.email || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Phone className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Điện thoại</p>
                <p className="font-medium">{user.phone || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Địa chỉ</p>
                <p className="font-medium">{user.address || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }} className="text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
                <CardDescription className="text-emerald-100">
                  Ngày sinh và chi nhánh
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-amber-100 rounded-full">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Ngày sinh</p>
                <p className="font-medium">{formatDate(user.dob)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-cyan-100 rounded-full">
                <Building2 className="h-4 w-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Chi nhánh</p>
                <p className="font-medium">{user.assignedBranchName || 'Chưa phân công'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-indigo-100 rounded-full">
                <Clock className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Đăng nhập cuối</p>
                <p className="font-medium">{formatDateTime(user.lastLoginAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Info section removed - failedLoginAttempts and lockedUntil not in User type */}

      {/* Roles & Permissions */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }} className="text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Vai trò & Quyền hạn</CardTitle>
              <CardDescription className="text-purple-100">
                Chi tiết phân quyền của người dùng
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {user.roles && user.roles.length > 0 ? (
            <div className="space-y-6">
              {user.roles.map((role, index) => {
                const config = ROLE_CONFIG[role.name];
                return (
                  <div key={role.id}>
                    {index > 0 && <Separator className="mb-6" />}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config?.bgColor || 'bg-gray-100'}`}>
                          <Shield className={`h-5 w-5 ${config?.color || 'text-gray-600'}`} />
                        </div>
                        <div>
                          <h4 className={`font-semibold ${config?.color || 'text-gray-700'}`}>
                            {config?.label || role.name}
                          </h4>
                          {role.description && (
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          )}
                        </div>
                      </div>

                      {role.permissions && role.permissions.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ml-11">
                          {role.permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                              <span className="text-gray-700 truncate" title={permission.name}>
                                {permission.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground ml-11">
                          Vai trò này chưa có quyền nào được gán
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Chưa có vai trò</h4>
              <p className="text-muted-foreground mt-1">
                Người dùng này chưa được phân quyền vai trò nào
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
