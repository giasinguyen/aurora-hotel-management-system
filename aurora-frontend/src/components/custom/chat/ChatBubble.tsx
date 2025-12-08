import React from "react";
import { BotMessageSquare, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

export interface ChatBubbleProps {
  isOpen: boolean;
  handleOpen: (updater: React.SetStateAction<boolean>) => void;
}

export default function ChatBubble({ isOpen, handleOpen }: ChatBubbleProps) {
  return (
    <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleOpen((prev) => !prev)}
              className={cn(
                "rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex justify-center items-center cursor-pointer",
                "w-14 h-14 sm:w-16 sm:h-16 border-2 border-white/30",
                isOpen
                  ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
                  : "bg-primary hover:bg-primary/90 shadow-primary/30"
              )}
            >
              {isOpen ? (
                <X size={26} color="white" />
              ) : (
                <BotMessageSquare size={26} color="white" />
              )}
            </button>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="left" align="center" className="mr-2">
              <p className="font-medium">Mình có thể giúp gì cho bạn? 😁</p>
            </TooltipContent>
          )}
        </Tooltip>
  );
}
