import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setLanguage } from "@/features/slices/languageSlice";
import { setBranch, setSelectionCompleted, BRANCHES } from "@/features/slices/branchSlice";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

// Language option component
const LanguageOption = ({ value }: { value: string }) => {
  const flags = {
    en: "/src/assets/images/commons/english.png",
    vi: "/src/assets/images/commons/vietnam.png",
  };
  return (
    <img
      src={flags[value as keyof typeof flags]}
      alt="languages"
      className="w-5 h-5 object-cover rounded-sm"
    />
  );
};

export default function SelectionModal() {
  const dispatch = useAppDispatch();
  const isSelectionCompleted = useAppSelector(
    (state) => state.branch.isSelectionCompleted
  );
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const currentBranch = useAppSelector(
    (state) => state.branch.currentBranch
  );

  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [selectedBranch, setSelectedBranch] = useState(currentBranch.id);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
    setSelectedBranch(currentBranch.id);
  }, [currentLanguage, currentBranch]);

  const handleClose = () => {
    // Set default: en and hcm
    dispatch(setLanguage("en"));
    dispatch(setBranch("hcm"));
    dispatch(setSelectionCompleted(true));
    
    // Lưu default branch vào localStorage
    const defaultBranch = BRANCHES.find(b => b.id === "hcm");
    if (defaultBranch) {
      localStorage.setItem('selectedBranchId', defaultBranch.apiId);
      localStorage.setItem('selectedBranchName', defaultBranch.name);
    }
  };

  const handleConfirm = () => {
    dispatch(setLanguage(selectedLanguage));
    dispatch(setBranch(selectedBranch));
    dispatch(setSelectionCompleted(true));
    
    // Lưu branchId vào localStorage để sử dụng trong accommodation
    const branch = BRANCHES.find(b => b.id === selectedBranch);
    if (branch) {
      localStorage.setItem('selectedBranchId', branch.apiId);
      localStorage.setItem('selectedBranchName', branch.name);
    }
  };

  if (isSelectionCompleted) {
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
            Chọn ngôn ngữ và chi nhánh
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
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
          </div>

          {/* Branch Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Chi nhánh / Branch
            </label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full justify-start text-left">
                <SelectValue placeholder="Chọn chi nhánh" />
              </SelectTrigger>
              <SelectContent className="!z-[10001]">
                {Object.values(BRANCHES).map((branch) => (
                  <SelectItem 
                    key={branch.id} 
                    value={branch.id}
                    className="group"
                  >
                    <span className="sr-only">{branch.name} ({branch.code})</span>
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
          </div>

          {/* Confirm Button */}
          <Button onClick={handleConfirm} className="w-full" size="lg">
            Xác nhận / Confirm
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}