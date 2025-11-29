import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  Lock, 
  Shield, 
  MapPin,
  Eye,
  EyeOff,
  Loader2,
  Save,
  X,
  Check
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { getRoles } from '@/services/roleApi';
import type { User, UserCreationRequest, UserUpdateRequest, Role } from '@/types/user.types';
import { ROLE_CONFIG } from '@/types/user.types';

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: UserCreationRequest | UserUpdateRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
}

export default function UserForm({ user, onSubmit, onCancel, isLoading = false }: UserFormProps) {
  const isEditMode = !!user;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(user?.active ?? true);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      username: user?.username || '',
      password: '',
      confirmPassword: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dob: user?.dob ? user.dob.split('T')[0] : '',
      address: user?.address || '',
    },
  });

  const password = watch('password');

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles({ page: 0, size: 100 });
        setRoles(response.result.content);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };
    fetchRoles();
  }, []);

  // Initialize selected roles from user
  useEffect(() => {
    if (user?.roles) {
      setSelectedRoles(user.roles.map(r => r.name));
    }
  }, [user]);

  const handleRoleToggle = (roleName: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleName) 
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleFormSubmit = async (data: FormData) => {
    if (isEditMode) {
      const updateData: UserUpdateRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        dob: data.dob || undefined,
        address: data.address || undefined,
        roles: selectedRoles,
        active: isActive,
      };
      await onSubmit(updateData);
    } else {
      const createData: UserCreationRequest = {
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        dob: data.dob || undefined,
        roles: selectedRoles,
      };
      await onSubmit(createData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Account & Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }} className="text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
                  <CardDescription className="text-blue-100 text-sm">
                    {isEditMode ? 'Cập nhật thông tin đăng nhập' : 'Tạo tài khoản mới'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                    <UserIcon className="h-3.5 w-3.5 text-blue-500" />
                    Tên đăng nhập <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="username"
                    placeholder="Nhập tên đăng nhập"
                    {...register('username', { 
                      required: !isEditMode && 'Tên đăng nhập là bắt buộc',
                      minLength: { value: 3, message: 'Tối thiểu 3 ký tự' },
                      maxLength: { value: 50, message: 'Tối đa 50 ký tự' },
                    })}
                    disabled={isEditMode}
                    className={`${errors.username ? 'border-destructive' : ''} ${isEditMode ? 'bg-muted' : ''}`}
                  />
                  {errors.username && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email không hợp lệ',
                      },
                    })}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Password fields - only show for create mode */}
              {!isEditMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="h-3.5 w-3.5 text-blue-500" />
                      Mật khẩu <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        {...register('password', {
                          required: !isEditMode && 'Mật khẩu là bắt buộc',
                          minLength: { value: 8, message: 'Tối thiểu 8 ký tự' },
                        })}
                        className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="h-3.5 w-3.5 text-blue-500" />
                      Xác nhận mật khẩu <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        {...register('confirmPassword', {
                          required: !isEditMode && 'Vui lòng xác nhận mật khẩu',
                          validate: value => !password || value === password || 'Mật khẩu không khớp',
                        })}
                        className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Active Status - only for edit mode */}
              {isEditMode && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold">Trạng thái tài khoản</Label>
                    <p className="text-xs text-muted-foreground">
                      {isActive ? 'Tài khoản đang hoạt động' : 'Tài khoản đã bị vô hiệu hóa'}
                    </p>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              )}
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
                  <CardDescription className="text-emerald-100 text-sm">
                    Họ tên, ngày sinh và thông tin liên hệ
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    Họ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Nguyễn"
                    {...register('firstName', { required: 'Họ là bắt buộc' })}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Tên <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Văn A"
                    {...register('lastName', { required: 'Tên là bắt buộc' })}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                    Ngày sinh
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    {...register('dob')}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    placeholder="0123456789"
                    {...register('phone', {
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: 'Số điện thoại không hợp lệ (10-15 chữ số)',
                      },
                    })}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                  Địa chỉ
                </Label>
                <Textarea
                  id="address"
                  placeholder="Nhập địa chỉ..."
                  {...register('address')}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Role Assignment */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-0 shadow-lg sticky top-6">
            <CardHeader style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }} className="text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Phân quyền vai trò</CardTitle>
                  <CardDescription className="text-purple-100 text-sm">
                    Chọn vai trò
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-3">
                {roles.map((role) => {
                  const config = ROLE_CONFIG[role.name] || { 
                    label: role.name, 
                    color: 'text-gray-700', 
                    bgColor: 'bg-gray-100' 
                  };
                  const isSelected = selectedRoles.includes(role.name);
                  
                  return (
                    <div
                      key={role.id}
                      onClick={() => handleRoleToggle(role.name)}
                      className={`
                        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? `border-purple-500 ${config.bgColor} shadow-lg scale-[1.02]` 
                          : 'border-gray-200 hover:border-purple-300 bg-white hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-all duration-200
                          ${isSelected 
                            ? 'bg-purple-500 border-purple-500 shadow-sm' 
                            : 'border-gray-300 bg-white'
                          }
                        `}>
                          {isSelected && <Check className="h-3.5 w-3.5 text-white font-bold" />}
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${isSelected ? config.color : 'text-gray-700'}`}>
                            {config.label}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {role.description || `Vai trò ${config.label}`}
                          </p>
                          {role.permissions && role.permissions.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {role.permissions.slice(0, 2).map((perm) => (
                                <span
                                  key={perm.id}
                                  className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                                >
                                  {perm.name.split('_')[0]}
                                </span>
                              ))}
                              {role.permissions.length > 2 && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                  +{role.permissions.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedRoles.length === 0 && (
                <p className="text-xs text-amber-600 mt-4 flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                  <Shield className="h-3.5 w-3.5" />
                  Chọn ít nhất một vai trò
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="gap-2 min-w-[120px]"
        >
          <X className="h-4 w-4" />
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isLoading || (!isDirty && isEditMode && selectedRoles.length === (user?.roles?.length || 0))}
          className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? 'Cập nhật' : 'Tạo người dùng'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
