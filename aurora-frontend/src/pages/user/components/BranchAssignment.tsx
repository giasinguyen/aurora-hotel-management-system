import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Building2, Loader2, MapPin, Check, X, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import branchApi from '@/services/branchApi';
import type { User } from '@/types/user.types';
import type { Branch } from '@/types/branch.types';

interface BranchAssignmentProps {
  user: User;
  onUpdate: () => void;
}

export default function BranchAssignment({ user, onUpdate }: BranchAssignmentProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Check if user is STAFF role
  const isStaff = user.roles?.some(r => r.name === 'STAFF');
  const currentBranchId = user.assignedBranchId;

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (currentBranchId) {
      setSelectedBranchId(currentBranchId);
    }
  }, [currentBranchId]);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const response = await branchApi.getAll({ page: 0, size: 100 });
      setBranches(response.result?.content || []);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      toast.error('Không thể tải danh sách chi nhánh');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedBranchId) {
      toast.error('Vui lòng chọn chi nhánh');
      return;
    }

    try {
      setIsSaving(true);
      await branchApi.assignStaff(selectedBranchId, user.id);
      toast.success('Đã phân chi nhánh thành công');
      onUpdate();
    } catch (error: any) {
      console.error('Failed to assign staff to branch:', error);
      const message = error.response?.data?.message || 'Không thể phân chi nhánh';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!currentBranchId) {
      toast.error('Nhân viên chưa được phân chi nhánh');
      return;
    }

    try {
      setIsSaving(true);
      await branchApi.removeStaff(currentBranchId, user.id);
      toast.success('Đã gỡ nhân viên khỏi chi nhánh');
      setSelectedBranchId('');
      onUpdate();
    } catch (error: any) {
      console.error('Failed to remove staff from branch:', error);
      const message = error.response?.data?.message || 'Không thể gỡ nhân viên khỏi chi nhánh';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isStaff) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Không khả dụng</AlertTitle>
        <AlertDescription>
          Chức năng phân chi nhánh chỉ áp dụng cho nhân viên (Staff).
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentBranch = branches.find(b => b.id === currentBranchId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle>Phân chi nhánh</CardTitle>
        </div>
        <CardDescription>
          Chọn chi nhánh để phân công nhân viên làm việc
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Assignment */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground mb-2">Chi nhánh hiện tại</p>
          {currentBranch ? (
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-lg">{currentBranch.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {currentBranch.address}, {currentBranch.city}
                </div>
              </div>
              <Badge variant="default" className="bg-emerald-500">
                <Check className="h-3 w-3 mr-1" />
                Đã phân công
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Chưa được phân chi nhánh</span>
            </div>
          )}
        </div>

        {/* Branch Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chọn chi nhánh mới</label>
            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chi nhánh..." />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{branch.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {branch.address}, {branch.city}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleAssign}
              disabled={isSaving || !selectedBranchId || selectedBranchId === currentBranchId}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Phân công
                </>
              )}
            </Button>

            {currentBranchId && (
              <Button
                variant="outline"
                onClick={handleRemove}
                disabled={isSaving}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Gỡ chi nhánh
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lưu ý</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside text-sm space-y-1 mt-1">
              <li>Mỗi nhân viên chỉ có thể làm việc tại một chi nhánh</li>
              <li>Việc phân chi nhánh sẽ ảnh hưởng đến ca làm việc và báo cáo</li>
              <li>Nhân viên cần được phân chi nhánh để có thể check-in ca làm</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
