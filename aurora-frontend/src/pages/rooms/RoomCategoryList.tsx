import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MoreHorizontal, Trash2, Edit, Plus, Check, X } from 'lucide-react';

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
  type Column 
} from '@/components/custom';

import { roomCategoryApi } from '@/services/roomApi';
import { branchApi } from '@/services/branchApi';
import type { RoomCategory } from '@/types/room.types';
import type { Branch } from '@/types/branch.types';

export default function RoomCategoryList() {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Load branches
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await branchApi.getAll();
        if (res.result?.content) {
          setBranches(res.result.content);
          if (res.result.content.length > 0) {
            setSelectedBranch(res.result.content[0].id);
          }
        }
      } catch (error) {
        toast.error('Failed to load branches');
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
        const res = await roomCategoryApi.getByBranch(selectedBranch);
        if (res.result) {
          setCategories(res.result);
        }
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [selectedBranch]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await roomCategoryApi.delete(deleteConfirm.id);
      setCategories(categories.filter(c => c.id !== deleteConfirm.id));
      toast.success('Category deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const columns: Column<RoomCategory>[] = [
    { 
      key: 'code',
      header: 'Code',
      cell: (row: RoomCategory) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.name}</span>
          <span className="text-sm text-gray-500">{row.code}</span>
        </div>
      )
    },
    { 
      key: 'branchName',
      header: 'Branch',
      cell: (row: RoomCategory) => row.branchName
    },
    { 
      key: 'description',
      header: 'Description',
      cell: (row: RoomCategory) => (
        <p className="max-w-xs truncate">{row.description || '-'}</p>
      )
    },
    {
      key: 'displayOrder',
      header: 'Order',
      cell: (row: RoomCategory) => row.displayOrder || 0,
    },
    {
      key: 'roomTypes',
      header: 'Room Types',
      cell: (row: RoomCategory) => (
        <Badge variant="outline">{row.roomTypes?.length || 0}</Badge>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      cell: (row: RoomCategory) => (
        row.active ? (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="h-3 w-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-400">
            <X className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (row: RoomCategory) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/admin/room-categories/upsert?id=${row.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteConfirm({ id: row.id, name: row.name })}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Room Categories"
        description="Manage room categories for your hotel"
      />

      <div className="flex gap-2 justify-between">
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
        <Button 
          onClick={() => navigate('/admin/room-categories/upsert')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No categories found</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={categories} 
              keyExtractor={(row) => row.id} 
            />
          )}
        </CardContent>
      </Card>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Delete Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
