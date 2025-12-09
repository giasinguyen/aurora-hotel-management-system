import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
// import { setLanguage } from "@/features/slices/languageSlice";
import { setBranchDetails } from "@/features/slices/branchSlice";
import { branchApi } from "@/services/branchApi";
import type { Branch } from "@/types/branch.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2 } from "lucide-react";
// import englishFlag from "@/assets/images/commons/english.png";
// import vietnamFlag from "@/assets/images/commons/vietnam.png";

// Language option component
// const LanguageOption = ({ value }: { value: string }) => {
//   const flags = {
//     en: englishFlag,
//     vi: vietnamFlag,
//   };
//   return (
//     <img
//       src={flags[value as keyof typeof flags]}
//       alt="languages"
//       className="w-5 h-5 object-cover rounded-sm"
//     />
//   );
// };

export default function SelectionModal() {
  const dispatch = useAppDispatch();
  // const currentLanguage = useAppSelector(
  //   (state) => state.language.currentLanguage
  // );
  const currentBranch = useAppSelector(
    (state) => state.branch.currentBranch
  );

  // const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [selectedBranch, setSelectedBranch] = useState(currentBranch?.id || '');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  
  // Show modal if no branchId in localStorage
  const shouldShowModal = !localStorage.getItem('branchId');

  // Fetch branches from database
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoadingBranches(true);
        const response = await branchApi.getActivePublic({ page: 0, size: 100 });
        
        if (response.result && response.result.content) {
          setBranches(response.result.content);
          
          // Auto-set first branch if no branch in localStorage
          if (!localStorage.getItem('branchId') && response.result.content.length > 0) {
            const firstBranch = response.result.content[0];
            setSelectedBranch(firstBranch.id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      } finally {
        setIsLoadingBranches(false);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    // setSelectedLanguage(currentLanguage);
    if (currentBranch?.id) {
      setSelectedBranch(currentBranch.id);
    }
  }, [currentBranch]);

  const handleClose = () => {
    // Set default: en and first active branch
    // dispatch(setLanguage("en"));
    if (branches.length > 0) {
      dispatch(setBranchDetails(branches[0]));
    }
  };

  const handleConfirm = () => {
    // dispatch(setLanguage(selectedLanguage));
    
    // Find and set full branch details
    const selectedBranchData = branches.find(b => b.id === selectedBranch);
    if (selectedBranchData) {
      dispatch(setBranchDetails(selectedBranchData));
    }
  };

  if (!shouldShowModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Chọn chi nhánh
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Language Selection */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Ngôn ngữ / Language
            </label>
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-full justify-start text-left">
                <LanguageOption value={selectedLanguage} />
                <SelectValue placeholder="Chọn ngôn ngữ" />
              </SelectTrigger>
              <SelectContent className="!z-[10001]">
                <SelectItem value="en">
                  English
                </SelectItem>
                <SelectItem value="vi">
                  Tiếng Việt
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Branch Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Chi nhánh / Branch
            </label>
            {isLoadingBranches ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-full justify-start text-left">
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
                <SelectContent className="!z-[10001]">
                  {branches.map((branch) => (
                    <SelectItem 
                      key={branch.id} 
                      value={branch.id}
                      className="group"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {branch.name} ({branch.code})
                        </span>
                        <span className="text-xs text-gray-500 group-data-[highlighted]:text-white group-data-[state=checked]:text-white">
                          {branch.address}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Confirm Button */}
          <Button 
            onClick={handleConfirm} 
            className="w-full" 
            size="lg"
            disabled={isLoadingBranches || !selectedBranch}
          >
            Xác nhận / Confirm
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}