import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/custom';

import { roomCategoryApi } from '@/services/roomApi';
import { branchApi } from '@/services/branchApi';
import type { Branch } from '@/types/branch.types';

export default function RoomCategoryUpsert() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const categoryId = searchParams.get('id');
  const isEdit = !!categoryId;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    branchId: '',
    branchName: '',
    displayOrder: 0,
    active: true,
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  // Load branches
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await branchApi.getAll();
        if (res.result?.content) {
          setBranches(res.result.content);
          // Set first branch as default if creating new
          if (!isEdit && res.result.content.length > 0) {
            const firstBranch = res.result.content[0];
            setFormData(prev => ({
              ...prev,
              branchId: firstBranch.id,
              branchName: firstBranch.name,
            }));
          }
        }
      } catch (error) {
        toast.error('Failed to load branches');
      }
    };
    loadBranches();
  }, [isEdit]);

  // Load category if editing
  useEffect(() => {
    if (!isEdit) {
      setIsLoading(false);
      return;
    }

    const loadCategory = async () => {
      try {
        setIsLoading(true);
        const res = await roomCategoryApi.getById(categoryId);
        if (res.result) {
          setFormData({
            name: res.result.name,
            code: res.result.code,
            description: res.result.description || '',
            branchId: res.result.branchId,
            branchName: res.result.branchName,
            displayOrder: res.result.displayOrder || 0,
            active: res.result.active ?? true,
          });
        }
      } catch (error) {
        toast.error('Failed to load category');
        navigate('/admin/room-categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [categoryId, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!formData.branchId) {
      toast.error('Branch is required');
      return;
    }

    try {
      setIsSaving(true);
      
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        description: formData.description.trim(),
        branchId: formData.branchId,
        branchName: formData.branchName,
        displayOrder: formData.displayOrder,
        active: formData.active,
      };

      if (isEdit) {
        await roomCategoryApi.update(categoryId, payload);
        toast.success('Category updated successfully');
      } else {
        await roomCategoryApi.create(payload);
        toast.success('Category created successfully');
      }

      navigate('/admin/room-categories');
    } catch (error) {
      toast.error(isEdit ? 'Failed to update category' : 'Failed to create category');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title={isEdit ? 'Edit Category' : 'New Category'} />
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/admin/room-categories')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader 
          title={isEdit ? 'Edit Category' : 'New Category'} 
          description={isEdit ? 'Update category details' : 'Create a new room category'}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Category' : 'Create Category'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch *</Label>
              <select
                id="branch"
                value={formData.branchId}
                onChange={(e) => {
                  const selectedBranch = branches.find(b => b.id === e.target.value);
                  setFormData(prev => ({ 
                    ...prev, 
                    branchId: e.target.value,
                    branchName: selectedBranch?.name || '',
                  }));
                }}
                className="w-full px-3 py-2 border rounded-md"
                disabled={isEdit}
              >
                <option value="">Select a branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Deluxe Room"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g., DLX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Room category description"
                rows={4}
                className="w-full px-3 py-2 border rounded-md resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">
                  <input
                    id="active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="mr-2"
                  />
                  Active
                </Label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/room-categories')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
