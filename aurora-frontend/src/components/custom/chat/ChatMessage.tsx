import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, RotateCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatbotAvatar from "./ChatbotAvatar";

export interface ChatMessageProps {
  isLoading: boolean;
  message: {
    id: string;
    role: string;
    content: string;
    error?: boolean;
    retryData?: {
      message: string;
      chatId: string;
    };
  };
  onRetry?: (message: string, messageId: string) => void;
}

export default function ChatMessage({
  isLoading,
  message,
  onRetry,
}: ChatMessageProps) {
  const handleRetry = () => {
    if (message.retryData && onRetry) {
      onRetry(message.retryData.message, message.id);
    }
  };

  return (
    <div
      key={message.id}
      className={cn(
        "flex w-full",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex gap-2 max-w-[85%]",
          message.role === "user" ? "flex-row-reverse" : "flex-row"
        )}
      >
        {message?.role === "ai" && (
          <div className="ml-1 w-9 h-9 flex-shrink-0">
            <ChatbotAvatar className="ring-1" />
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all",
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : message.error
              ? "bg-red-50 text-red-900 border border-red-200"
              : "bg-white text-foreground border border-gray-200 shadow-md"
          )}
        >
          {/* --- Render Markdown --- */}
          {message.role === "ai" ? (
            <div
              className={cn(
                "prose prose-sm dark:prose-invert max-w-none break-words",
                "[&>p]:mb-2 [&>p:last-child]:mb-0 [&>p]:leading-relaxed",
                "[&>pre]:bg-gray-800 [&>pre]:text-white [&>pre]:p-3 [&>pre]:rounded-lg [&>pre]:text-xs [&>pre]:overflow-x-auto",
                "[&>code]:bg-gray-100 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>code]:text-gray-800",
                "[&>ul]:my-2 [&>ol]:my-2 [&>li]:my-1",
                "[&>h1]:text-lg [&>h1]:font-semibold [&>h1]:mt-4 [&>h1]:mb-2",
                "[&>h2]:text-base [&>h2]:font-semibold [&>h2]:mt-3 [&>h2]:mb-2",
                "[&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mt-2 [&>h3]:mb-1"
              )}
            >
              {isLoading && !message.error && !message.content ? (
                <div className="flex w-full justify-start">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-gray-600 font-medium">
                      AI đang soạn tin...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>

                  {/* Show retry button on error */}
                  {message.error && message.retryData && onRetry && (
                    <div className="mt-3 pt-2 border-t border-red-200">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRetry}
                        className="text-red-700 border-red-300 hover:bg-red-100 hover:text-red-800"
                        disabled={isLoading}
                      >
                        <RotateCw className="h-3 w-3 mr-1" />
                        Thử lại
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
