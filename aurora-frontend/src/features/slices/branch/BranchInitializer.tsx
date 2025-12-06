import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setBranchDetails } from '@/features/slices/branch/branchSlice';
import { branchApi } from '@/services/branchApi';

/**
 * Component to fetch and sync branch data from localStorage
 */
export default function BranchInitializer() {
  const dispatch = useAppDispatch();
  const currentBranch = useAppSelector((state) => state.branch.currentBranch);

  useEffect(() => {
    const fetchBranchDetails = async (branchId: string) => {
      try {
        console.log('Fetching branch details for:', branchId);
        const response = await branchApi.getById(branchId);
        if (response.result) {
          console.log('Branch details fetched:', response.result);
          dispatch(setBranchDetails(response.result));
        }
      } catch (error) {
        console.error('Failed to fetch branch details:', error);
      }
    };

    const branchId = localStorage.getItem('branchId');
    
    // Fetch if branchId exists and current branch has no name (not loaded yet)
    if (branchId && (!currentBranch || !currentBranch.name)) {
      fetchBranchDetails(branchId);
    }
    
    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'branchId' && e.newValue) {
        fetchBranchDetails(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch, currentBranch]);

  return null;
}
