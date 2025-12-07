import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MoreHorizontal, Trash2, Edit, Plus, Check, X } from 'lucide-react';
import fallbackImage from '@/assets/images/commons/fallback.png';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { 
  PageHeader, 
  DataTable,
  ConfirmDialog,
  type Column 
} from '@/components/custom';

import { serviceCategoryApi } from '@/services/serviceCategoryApi';
import { branchApi } from '@/services/branchApi';
import type { ServiceCategory } from '@/types/serviceCategory.types';
import type { Branch } from '@/types/branch.types';

export default function ServiceCategoryList() {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');

  // Load branches
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await branchApi.getAll({ page: 0, size: 100 });
        if (res.result?.content) {
          setBranches(res.result.content);
          if (res.result.content.length > 0) {
            setSelectedBranch(res.result.content[0].id);
          }
        }
      } catch (error) {
        toast.error('Không thể tải danh sách chi nhánh');
      }
    };
    loadBranches();
  }, []);

  // Load categories
  useEffect(() => {
    if (!selectedBranch) return;

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const res = await serviceCategoryApi.getByBranch(selectedBranch);
        if (res.result) {
          setCategories(res.result);
        }
      } catch (error) {
        toast.error('Không thể tải danh sách danh mục dịch vụ');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [selectedBranch]);

  const handleDelete = async () => {
    if (!selectedCategoryId) return;

    try {
      await serviceCategoryApi.delete(selectedCategoryId);
      setCategories(categories.filter(c => c.id !== selectedCategoryId));
      toast.success('Xóa danh mục dịch vụ thành công');
      setDeleteDialogOpen(false);
      setSelectedCategoryId(null);
    } catch (error) {
      toast.error('Không thể xóa danh mục dịch vụ');
    }
  };

  const handleDeleteClick = (category: ServiceCategory) => {
    setSelectedCategoryId(category.id);
    setSelectedCategoryName(category.name);
    setDeleteDialogOpen(true);
  };

  const columns: Column<ServiceCategory>[] = [
    {
      key: 'image',
      header: 'Ảnh',
      cell: (row: ServiceCategory) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          <img
            src={row.imageUrl || fallbackImage}
            alt={row.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>
      ),
      className: 'w-[80px]',
    },
    { 
      key: 'name',
      header: 'Tên danh mục',
      cell: (row: ServiceCategory) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.name}</span>
          <span className="text-sm text-gray-500">{row.code}</span>
        </div>
      )
    },
    { 
      key: 'branchName',
      header: 'Chi nhánh',
      cell: (row: ServiceCategory) => row.branchName
    },
    { 
      key: 'description',
      header: 'Mô tả',
      cell: (row: ServiceCategory) => (
        <p className="max-w-xs truncate">{row.description || '-'}</p>
      )
    },
    {
      key: 'displayOrder',
      header: 'Thứ tự',
      cell: (row: ServiceCategory) => row.displayOrder || 0,
    },
    {
      key: 'totalServices',
      header: 'Số dịch vụ',
      cell: (row: ServiceCategory) => (
        <Badge variant="outline">{row.totalServices || 0}</Badge>
      ),
    },
    {
      key: 'active',
      header: 'Trạng thái',
      cell: (row: ServiceCategory) => (
        row.active ? (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="h-3 w-3 mr-1" />
            Hoạt động
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-400">
            <X className="h-3 w-3 mr-1" />
            Ngừng hoạt động
          </Badge>
        )
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (row: ServiceCategory) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/admin/service-categories/upsert?id=${row.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDeleteClick(row)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý danh mục dịch vụ"
        description="Xem và quản lý tất cả danh mục dịch vụ trong hệ thống"
        onAdd={() => navigate('/admin/service-categories/upsert')}
        addButtonText="Thêm danh mục"
        onRefresh={() => {
          if (selectedBranch) {
            // Reload categories
            const loadCategories = async () => {
              try {
                setIsLoading(true);
                const res = await serviceCategoryApi.getByBranch(selectedBranch);
                if (res.result) {
                  setCategories(res.result);
                }
              } catch (error) {
                toast.error('Không thể tải danh sách danh mục dịch vụ');
              } finally {
                setIsLoading(false);
              }
            };
            loadCategories();
          }
        }}
        isLoading={isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1 max-w-md">
              <label className="text-sm font-medium mb-2 block">Chi nhánh</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Danh sách danh mục ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có danh mục dịch vụ nào
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={categories} 
              keyExtractor={(row) => row.id} 
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa danh mục dịch vụ"
        description={`Bạn có chắc chắn muốn xóa danh mục "${selectedCategoryName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}


