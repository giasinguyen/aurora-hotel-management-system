import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Building2, 
  UserCog, 
  Users, 
  CheckCircle2, 
  Loader2,
  Search,
  X
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { branchApi } from '@/services/branchApi';
import { getUsersByRole } from '@/services/userApi';
import type { Branch } from '@/types/branch.types';
import type { User } from '@/types/user.types';

const AssignBranchPage = () => {
  const navigate = useNavigate();
  const { branchId } = useParams<{ branchId: string }>();
  
  const [branch, setBranch] = useState<Branch | null>(null);
  const [managers, setManagers] = useState<User[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<User[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch branch data
  useEffect(() => {
    const fetchBranch = async () => {
      if (!branchId) {
        toast.error('Không tìm thấy chi nhánh');
        navigate('/admin/branches');
        return;
      }

      try {
        setIsLoading(true);
        const response = await branchApi.getById(branchId);
        if (response.result) {
          setBranch(response.result);
          // Set current manager if exists
          if (response.result.managerId) {
            setSelectedManagerId(response.result.managerId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch branch:', error);
        toast.error('Không thể tải thông tin chi nhánh');
        navigate('/admin/branches');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranch();
  }, [branchId, navigate]);

  // Fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        // Try both role name formats
        let response;
        try {
          response = await getUsersByRole('MANAGER', { 
            page: 0, 
            size: 100,
            sortBy: 'username',
            sortDir: 'asc'
          });
        } catch (e) {
          // Try with ROLE_ prefix
          console.log('Trying ROLE_MANAGER...');
          response = await getUsersByRole('ROLE_MANAGER', { 
            page: 0, 
            size: 100,
            sortBy: 'username',
            sortDir: 'asc'
          });
        }
        
        if (response.result) {
          const managerList = response.result.content || [];
          console.log('Fetched managers:', managerList.length, managerList);
          setManagers(managerList);
          setFilteredManagers(managerList);
          
          if (managerList.length === 0) {
            toast.warning('Không có quản lý nào trong hệ thống. Vui lòng tạo tài khoản quản lý trước.');
          }
        }
      } catch (error) {
        console.error('Failed to fetch managers:', error);
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể tải danh sách quản lý';
        toast.error(errorMessage);
      }
    };

    fetchManagers();
  }, []);

  // Filter managers by search keyword
  useEffect(() => {
    if (!searchKeyword.trim()) {
      setFilteredManagers(managers);
      return;
    }

    const keyword = searchKeyword.toLowerCase();
    const filtered = managers.filter(manager => 
      manager.username?.toLowerCase().includes(keyword) ||
      manager.firstName?.toLowerCase().includes(keyword) ||
      manager.lastName?.toLowerCase().includes(keyword) ||
      manager.email?.toLowerCase().includes(keyword)
    );
    setFilteredManagers(filtered);
  }, [searchKeyword, managers]);

  // Handle assign manager
  const handleAssignManager = async () => {
    if (!branchId) return;

    try {
      setIsSubmitting(true);
      
      if (selectedManagerId) {
        await branchApi.assignManager(branchId, selectedManagerId);
        toast.success('Phân công quản lý thành công');
      } else {
        // Remove manager
        // Note: Backend might need a remove manager endpoint
        toast.error('Chức năng gỡ quản lý chưa được hỗ trợ');
        return;
      }

      // Refresh branch data
      const response = await branchApi.getById(branchId);
      if (response.result) {
        setBranch(response.result);
      }

      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/admin/branches');
      }, 1500);
    } catch (error) {
      console.error('Failed to assign manager:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể phân công quản lý';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle remove manager
  const handleRemoveManager = async () => {
    if (!branchId || !branch?.managerId) return;

    try {
      setIsSubmitting(true);
      await branchApi.removeManager(branchId);
      toast.success('Gỡ quản lý thành công');
      
      // Refresh branch data
      const response = await branchApi.getById(branchId);
      if (response.result) {
        setBranch(response.result);
        setSelectedManagerId(null);
      }

      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/admin/branches');
      }, 1500);
    } catch (error) {
      console.error('Failed to remove manager:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể gỡ quản lý';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!branch) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/admin/branches')}
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UserCog className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Phân công quản lý</h1>
            <p className="text-muted-foreground">
              Chi nhánh: <span className="font-semibold">{branch.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Branch Info Card */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-primary">{branch.name}</CardTitle>
              <CardDescription className="text-primary/70">
                {branch.code} • {branch.city}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {branch.managerName ? (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Quản lý hiện tại</p>
                  <p className="text-sm text-green-700">{branch.managerName}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveManager}
                disabled={isSubmitting}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Gỡ quản lý
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Users className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-900">Chưa có quản lý được phân công</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Managers List */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Users className="h-5 w-5" />
            Chọn quản lý
          </CardTitle>
          <CardDescription>
            Chọn một quản lý từ danh sách để phân công cho chi nhánh này
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, username, email..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Managers List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredManagers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchKeyword ? 'Không tìm thấy quản lý nào' : 'Không có quản lý nào'}
              </div>
            ) : (
              filteredManagers.map((manager) => {
                const isSelected = selectedManagerId === manager.id;
                const isCurrentManager = branch.managerId === manager.id;
                const fullName = `${manager.firstName || ''} ${manager.lastName || ''}`.trim() || manager.username;

                return (
                  <div
                    key={manager.id}
                    onClick={() => !isCurrentManager && setSelectedManagerId(manager.id)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : isCurrentManager
                        ? 'border-green-300 bg-green-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-semibold
                          ${isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}
                        `}>
                          {fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{fullName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-muted-foreground">@{manager.username}</p>
                            {manager.email && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <p className="text-sm text-muted-foreground">{manager.email}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCurrentManager && (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                            Quản lý hiện tại
                          </Badge>
                        )}
                        {isSelected && !isCurrentManager && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/branches')}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button
          onClick={handleAssignManager}
          disabled={isSubmitting || !selectedManagerId || selectedManagerId === branch.managerId}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <UserCog className="h-4 w-4 mr-2" />
              Phân công quản lý
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AssignBranchPage;
