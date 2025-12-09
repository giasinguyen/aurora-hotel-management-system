import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus,
  Users,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { workShiftApi, staffShiftApi } from '@/services/shiftApi';
import { getUsersByRole } from '@/services/userApi';
import { branchApi } from '@/services/branchApi';
import type { WorkShift, WorkShiftCreationRequest, StaffShiftAssignmentRequest, StaffShiftAssignment } from '@/types/shift.types';
import type { User } from '@/types/user.types';
import type { Branch } from '@/types/branch.types';
import { useSelector } from 'react-redux';
import type { RootState } from '@/features/store';
import { WorkflowGuide } from './components/WorkflowGuide';
import { ShiftCalendarView } from './components/ShiftCalendarView';
import { AssignmentListView } from './components/AssignmentListView';

export default function ShiftManagement() {
  // Get current user from Redux
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  // State
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [assignments, setAssignments] = useState<StaffShiftAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Branch selection for admin users (who don't have fixed branchId)
  const [selectedBranchId, setSelectedBranchId] = useState<string>(currentUser.branchId || '');
  
  // Dialog states
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  
  // Form states - Shift
  const [shiftForm, setShiftForm] = useState<WorkShiftCreationRequest>({
    name: '',
    description: '',
    startTime: '08:00',
    endTime: '16:00',
    colorCode: '#3b82f6',
  });
  
  // Form states - Assignment
  const [selectedShiftId, setSelectedShiftId] = useState('');
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  // Load assignments function
  const loadAssignments = useCallback(async () => {
    try {
      // Lấy assignments cho tháng hiện tại
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];
      
      // Use branchId if available (for staff/manager), otherwise undefined (for admin to see all)
      const branchId = currentUser.branchId || selectedBranchId || undefined;
      
      console.log('Loading assignments:', { startDate, endDate, branchId });
      
      const response = await staffShiftApi.getShiftsInRange(startDate, endDate, branchId);
      
      console.log('Assignments response:', response.data);
      
      if (response.data.result) {
        console.log('Assignments loaded:', response.data.result.length, 'items');
        setAssignments(response.data.result);
      }
    } catch (error) {
      console.error('Không thể tải danh sách phân công:', error);
    }
  }, [currentUser.branchId, selectedBranchId]);

  // Load data
  useEffect(() => {
    loadShifts();
    loadUsers();
    loadBranches();
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload assignments when branch selection changes
  useEffect(() => {
    if (selectedBranchId) {
      loadAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranchId]);

  const loadShifts = async () => {
    try {
      setIsLoading(true);
      const response = await workShiftApi.getAllActiveShifts();
      if (response.data.result) {
        setShifts(response.data.result);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error('Không thể tải danh sách ca làm việc', {
        description: err.message || 'Đã có lỗi xảy ra',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // Use getUsersByRole API for STAFF - Manager has permission for this
      const response = await getUsersByRole('STAFF', { page: 0, size: 1000 });
      if (response.result?.content) {
        // Filter only active staff
        const staffUsers = response.result.content.filter((user: User) => user.active);
        setUsers(staffUsers);
        console.log('Loaded STAFF users:', staffUsers.length);
      }
    } catch (error) {
      console.error('Không thể tải danh sách nhân viên:', error);
      toast.error('Không thể tải danh sách nhân viên');
    }
  };

  const loadBranches = useCallback(async () => {
    try {
      const response = await branchApi.getAll({ page: 0, size: 100 });
      if (response.result?.content) {
        setBranches(response.result.content);
        // Auto-select first branch if admin has no branchId
        if (!currentUser.branchId && response.result.content.length > 0) {
          setSelectedBranchId(response.result.content[0].id);
        }
      }
    } catch (error) {
      console.error('Không thể tải danh sách chi nhánh:', error);
    }
  }, [currentUser.branchId]);

  // Create or update shift
  const handleSaveShift = async () => {
    try {
      if (!shiftForm.name || !shiftForm.startTime || !shiftForm.endTime) {
        toast.error('Vui lòng điền đầy đủ thông tin ca làm việc');
        return;
      }

      console.log('Creating/updating shift with data:', shiftForm);

      if (editingShift) {
        await workShiftApi.updateShift(editingShift.id, shiftForm);
        toast.success('Cập nhật ca làm việc thành công');
      } else {
        await workShiftApi.createShift(shiftForm);
        toast.success('Tạo ca làm việc mới thành công');
      }
      
      setShiftDialogOpen(false);
      setEditingShift(null);
      resetShiftForm();
      loadShifts();
    } catch (error) {
      const err = error as { 
        response?: { 
          data?: { 
            message?: string; 
            error?: string;
          } 
        }; 
        message?: string 
      };
      
      console.log('Error creating shift:', err);
      console.log('Error response data:', err?.response?.data);
      
      let errorMessage = 
        err?.response?.data?.message || 
        err?.response?.data?.error || 
        err?.message || 
        'Đã có lỗi xảy ra';
      
      // Dịch message sang tiếng Việt
      if (errorMessage === 'Shift time overlaps with existing shift') {
        errorMessage = 'Khung giờ ca làm việc bị trùng với ca làm việc đã tồn tại';
      } else if (errorMessage === 'Start time must be before end time') {
        errorMessage = 'Giờ bắt đầu phải trước giờ kết thúc';
      }
      
      toast.error('Không thể lưu ca làm việc', {
        description: errorMessage,
      });
    }
  };

  // Delete shift
  const handleDeleteShift = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa ca làm việc này?')) return;
    
    try {
      await workShiftApi.deleteShift(id);
      toast.success('Xóa ca làm việc thành công');
      loadShifts();
    } catch (error) {
      const err = error as { message?: string };
      toast.error('Không thể xóa ca làm việc', {
        description: err.message || 'Đã có lỗi xảy ra',
      });
    }
  };

  // Assign staff to shift
  const handleAssignStaff = async () => {
    try {
      if (!selectedShiftId || !assignmentDate || selectedStaffIds.length === 0) {
        toast.error('Vui lòng chọn ca, ngày và ít nhất 1 nhân viên');
        return;
      }

      // Use selectedBranchId for admin, or currentUser.branchId for staff/manager
      const branchId = currentUser.branchId || selectedBranchId;
      
      if (!branchId || !currentUser.id) {
        toast.error('Vui lòng chọn chi nhánh và đảm bảo đã đăng nhập');
        return;
      }

      const assignments: StaffShiftAssignmentRequest[] = selectedStaffIds.map(staffId => ({
        staffId: staffId,
        workShiftId: selectedShiftId,
        shiftDate: assignmentDate,
        branchId: branchId,
        assignedById: currentUser.id,
      }));

      // Assign từng nhân viên và theo dõi kết quả
      const results = await Promise.allSettled(
        assignments.map(assignment => staffShiftApi.assignShift(assignment))
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const failedCount = results.filter(r => r.status === 'rejected').length;

      if (successCount > 0) {
        toast.success(`Đã phân công ${successCount} nhân viên thành công`);
      }

      if (failedCount > 0) {
        const failedReasons = results
          .filter(r => r.status === 'rejected')
          .map((r: PromiseRejectedResult) => {
            const error = r.reason as { 
              response?: { 
                data?: { 
                  message?: string; 
                  error?: string;
                } 
              }; 
              message?: string 
            };
            
            // Lấy message từ response.data.message (đã xác nhận từ backend)
            const errorMessage = 
              error?.response?.data?.message || 
              error?.response?.data?.error || 
              error?.message || 
              'Lỗi không xác định';
            
            // Dịch message sang tiếng Việt
            if (errorMessage === 'Staff already assigned to this shift on this date') {
              return 'Nhân viên đã được phân công cho ca này trong ngày này';
            }
            
            return errorMessage;
          });
        
        const uniqueReasons = [...new Set(failedReasons)];
        toast.error(`Không thể phân công ${failedCount} nhân viên`, {
          description: uniqueReasons.join('; '),
          duration: 5000,
        });
      }

      resetAssignmentForm();
      
      // Reload assignments to update calendar
      await loadAssignments();
    } catch (error) {
      const err = error as { message?: string };
      toast.error('Không thể phân công nhân viên', {
        description: err.message || 'Đã có lỗi xảy ra',
      });
    }
  };

  // Reset forms
  const resetShiftForm = () => {
    setShiftForm({
      name: '',
      description: '',
      startTime: '08:00',
      endTime: '16:00',
      colorCode: '#3b82f6',
    });
  };

  const resetAssignmentForm = () => {
    setSelectedShiftId('');
    setAssignmentDate(new Date().toISOString().split('T')[0]);
    setSelectedStaffIds([]);
  };

  // Edit shift
  const handleEditShift = (shift: WorkShift) => {
    setEditingShift(shift);
    setShiftForm({
      name: shift.name,
      description: shift.description || '',
      startTime: shift.startTime,
      endTime: shift.endTime,
      colorCode: shift.colorCode,
    });
    setShiftDialogOpen(true);
  };

  // Open create dialog
  const handleCreateNew = () => {
    setEditingShift(null);
    resetShiftForm();
    setShiftDialogOpen(true);
  };

  // Toggle staff selection
  const toggleStaffSelection = (staffId: string) => {
    setSelectedStaffIds(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Workflow Guide */}
      <WorkflowGuide />

      {/* Main content with tabs */}
      <Tabs defaultValue="shifts" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="shifts" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Danh sách ca
          </TabsTrigger>
          <TabsTrigger value="assign" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Phân công nhân viên
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Lịch tổng quan
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Shift List */}
        <TabsContent value="shifts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Danh sách ca làm việc</h3>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo ca mới
            </Button>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Đang tải...
              </CardContent>
            </Card>
          ) : shifts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Chưa có ca làm việc nào</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Nhấn "Tạo ca mới" để thêm ca làm việc đầu tiên
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shifts.map((shift) => (
                <Card key={shift.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: shift.colorCode }}
                        />
                        <div>
                          <CardTitle className="text-lg">{shift.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {shift.description || 'Không có mô tả'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={shift.active ? 'default' : 'secondary'}>
                        {shift.active ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{shift.startTime}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{shift.endTime}</span>
                        <span className="text-muted-foreground">
                          ({shift.durationHours}h)
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditShift(shift)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteShift(shift.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Staff Assignment */}
        <TabsContent value="assign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Phân công nhân viên vào ca
              </CardTitle>
              <CardDescription>
                Chọn ca làm việc, ngày và nhân viên để phân công
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Branch selection - Only show for admin users without fixed branchId */}
              {!currentUser.branchId && branches.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="branch-select">Chọn chi nhánh *</Label>
                  <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                    <SelectTrigger id="branch-select">
                      <SelectValue placeholder="-- Chọn chi nhánh --" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} - {branch.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Shift selection */}
              <div className="space-y-2">
                <Label htmlFor="shift-select">Chọn ca làm việc *</Label>
                <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
                  <SelectTrigger id="shift-select">
                    <SelectValue placeholder="-- Chọn ca --" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.filter(s => s.active).map((shift) => (
                      <SelectItem key={shift.id} value={shift.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: shift.colorCode }}
                          />
                          {shift.name} ({shift.startTime} - {shift.endTime})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date selection */}
              <div className="space-y-2">
                <Label htmlFor="date-input">Ngày làm việc *</Label>
                <Input
                  id="date-input"
                  type="date"
                  value={assignmentDate}
                  onChange={(e) => setAssignmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Staff selection */}
              <div className="space-y-2">
                <Label>Chọn nhân viên * ({selectedStaffIds.length} đã chọn)</Label>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
                  {users.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Không có nhân viên nào
                    </p>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => toggleStaffSelection(user.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedStaffIds.includes(user.id)}
                          onChange={() => toggleStaffSelection(user.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <p className="font-medium">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user.username}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email} • {user.roles.map(r => r.name).join(', ')}
                          </p>
                        </div>
                        {selectedStaffIds.includes(user.id) && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submit button */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleAssignStaff}
                disabled={!selectedShiftId || !assignmentDate || selectedStaffIds.length === 0}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Phân công {selectedStaffIds.length > 0 && `(${selectedStaffIds.length} nhân viên)`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Lịch tổng quan ca làm việc
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Xem lịch phân công nhân viên theo ca làm việc
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  {/* Branch selector for admin */}
                  {!currentUser.branchId && branches.length > 0 && (
                    <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Chọn chi nhánh" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {/* Branch name for staff/manager */}
                  {currentUser.branchId && (
                    <div className="text-sm text-muted-foreground">
                      Chi nhánh: <span className="font-medium text-foreground">{currentUser.branchName}</span>
                    </div>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={loadAssignments}>
                    <Clock className="h-4 w-4 mr-2" />
                    Làm mới
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
                  <TabsTrigger value="calendar">Lịch</TabsTrigger>
                  <TabsTrigger value="list">Danh sách</TabsTrigger>
                </TabsList>
                
                <TabsContent value="calendar" className="mt-0">
                  <ShiftCalendarView 
                    assignments={assignments} 
                    onRefresh={loadAssignments}
                  />
                </TabsContent>
                
                <TabsContent value="list" className="mt-0">
                  <AssignmentListView 
                    assignments={assignments}
                    onRefresh={loadAssignments}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Shift Dialog */}
      <Dialog open={shiftDialogOpen} onOpenChange={setShiftDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingShift ? 'Chỉnh sửa ca làm việc' : 'Tạo ca làm việc mới'}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin ca làm việc dưới đây
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên ca làm việc *</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Ca sáng, Ca chiều..."
                value={shiftForm.name}
                onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                placeholder="Mô tả về ca làm việc (không bắt buộc)"
                value={shiftForm.description}
                onChange={(e) => setShiftForm({ ...shiftForm, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Giờ bắt đầu *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={shiftForm.startTime}
                  onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Giờ kết thúc *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={shiftForm.endTime}
                  onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorCode">Màu sắc</Label>
              <div className="flex gap-2">
                <Input
                  id="colorCode"
                  type="color"
                  value={shiftForm.colorCode}
                  onChange={(e) => setShiftForm({ ...shiftForm, colorCode: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={shiftForm.colorCode}
                  onChange={(e) => setShiftForm({ ...shiftForm, colorCode: e.target.value })}
                  className="flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShiftDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveShift}>
              {editingShift ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
