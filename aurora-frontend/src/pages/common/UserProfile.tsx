import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X, 
  Building2, 
  Key, 
  Clock,
  Loader2,
  CheckCircle,
  Camera
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import { getMyInfo } from '@/services/userApi';
import { getSessions } from '@/services/authApi';
import type { User as UserType } from '@/types/user.types';
import type { SessionMetaResponse } from '@/types/user.d.ts';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import axiosClient from '@/config/axiosClient';

const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);
  
  // States
  const [user, setUser] = useState<UserType | null>(null);
  const [sessions, setSessions] = useState<SessionMetaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
  });

  // Xác định role từ URL
  const role = location.pathname.split('/')[1] as 'staff' | 'manager' | 'admin';

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, sessionsRes] = await Promise.all([
          getMyInfo(),
          getSessions(),
        ]);
        
        if (userRes.result) {
          setUser(userRes.result);
          setEditForm({
            firstName: userRes.result.firstName || '',
            lastName: userRes.result.lastName || '',
            email: userRes.result.email || '',
            phone: userRes.result.phone || '',
            address: userRes.result.address || '',
            dob: userRes.result.dob || '',
          });
        }
        
        if (sessionsRes.data?.result) {
          setSessions(sessionsRes.data.result);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleLabel = (roleName?: string) => {
    if (roleName) {
      switch (roleName.toUpperCase()) {
        case 'ADMIN': return 'Quản trị viên';
        case 'MANAGER': return 'Quản lý';
        case 'STAFF': return 'Nhân viên';
        case 'CUSTOMER': return 'Khách hàng';
        default: return roleName;
      }
    }
    switch (role) {
      case 'staff': return 'Nhân viên';
      case 'manager': return 'Quản lý';
      case 'admin': return 'Quản trị viên';
      default: return '';
    }
  };

  const getRoleBadgeColor = (roleName?: string) => {
    const r = roleName?.toUpperCase() || role.toUpperCase();
    switch (r) {
      case 'STAFF': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'MANAGER': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'ADMIN': return 'bg-red-100 text-red-800 border-red-300';
      case 'CUSTOMER': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi });
    } catch {
      return dateString;
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Only send profile-related fields (no active, roles)
      const profileData = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        dob: editForm.dob || null,
      };
      
      await axiosClient.put('/api/v1/users/myInfo', profileData);
      
      // Refresh user data
      const userRes = await getMyInfo();
      if (userRes.result) {
        setUser(userRes.result);
      }
      
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dob: user.dob || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayUser = user || {
    id: authUser.id,
    username: authUser.username,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    email: authUser.email,
    avatarUrl: authUser.avatarUrl,
    roles: authUser.roles?.map(r => ({ id: r, name: r, permissions: [] })) || [],
    active: true,
    assignedBranchId: authUser.branchId,
    assignedBranchName: authUser.branchName,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-500 mt-2">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="sessions">Phiên đăng nhập</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative group">
                    <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                      {displayUser.avatarUrl ? (
                        <AvatarImage src={displayUser.avatarUrl} alt={displayUser.username} />
                      ) : null}
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/60 text-white">
                        {getInitials(displayUser.firstName, displayUser.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {displayUser.firstName} {displayUser.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">@{displayUser.username}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {displayUser.roles?.map((role, index) => (
                        <Badge key={index} className={getRoleBadgeColor(typeof role === 'string' ? role : role.name)}>
                          <Shield className="w-3 h-3 mr-1" />
                          {getRoleLabel(typeof role === 'string' ? role : role.name)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{displayUser.email || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{user?.phone || 'Chưa cập nhật'}</span>
                    </div>
                    {displayUser.assignedBranchName && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{displayUser.assignedBranchName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Tham gia {formatDate(user?.createdAt)}</span>
                    </div>
                  </div>

                  {user?.active !== undefined && (
                    <Badge variant="outline" className={user.active 
                      ? 'bg-green-50 text-green-700 border-green-300' 
                      : 'bg-red-50 text-red-700 border-red-300'
                    }>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {user.active ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 py-2">{displayUser.firstName || 'Chưa cập nhật'}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 py-2">{displayUser.lastName || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 py-2">{displayUser.email || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 py-2">{user?.phone || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Ngày sinh</Label>
                    {isEditing ? (
                      <Input
                        id="dob"
                        type="date"
                        value={editForm.dob}
                        onChange={(e) => setEditForm(prev => ({ ...prev, dob: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 py-2">{formatDate(user?.dob)}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tên đăng nhập</Label>
                    <p className="text-sm text-gray-900 py-2">{displayUser.username}</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ
                    </Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editForm.address}
                        onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Nhập địa chỉ của bạn"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 py-2">{user?.address || 'Chưa cập nhật'}</p>
                    )}
                  </div>
                </div>

                {displayUser.assignedBranchName && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Thông tin công việc
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Chi nhánh làm việc</Label>
                          <p className="text-sm text-gray-900 py-2">{displayUser.assignedBranchName}</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Đăng nhập lần cuối</Label>
                          <p className="text-sm text-gray-900 py-2">{formatDateTime(user?.lastLoginAt)}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Bảo mật tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Đổi mật khẩu</h3>
                  <p className="text-sm text-gray-500">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                </div>
                <Button variant="outline" onClick={() => navigate(`/${role}/change-password`)}>
                  Đổi mật khẩu
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Quyền hạn của bạn</h3>
                <div className="flex flex-wrap gap-2">
                  {authUser.permissions?.slice(0, 10).map((permission, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                  {authUser.permissions?.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{authUser.permissions.length - 10} quyền khác
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Phiên đăng nhập
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Không có thông tin phiên đăng nhập
                </p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div 
                      key={session.sessionId} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        session.current ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{session.deviceName}</h4>
                            {session.current && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Phiên hiện tại
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{session.deviceType}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Đăng nhập {formatDateTime(session.loginAt)}
                          </p>
                        </div>
                      </div>
                      {/* {!session.current && (
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          Đăng xuất
                        </Button>
                      )} */}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
