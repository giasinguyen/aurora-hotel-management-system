"use client";

import * as React from "react";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  initializeChat,
  addUserMessage,
  addOrUpdateAiMessage,
  setStreaming,
  setError,
} from "@/features/slices/ragSlice";
import { buildRagWebSocketUrl, generateChatId } from "@/services/ragApi";
import { toast } from "sonner";

import ChatBubble from "./ChatBubble";
import ChatMessage from "./ChatMessage";
import ChatbotAvatar from "./ChatbotAvatar";

interface WebSocketMessage {
  type: "connection" | "chunk" | "complete" | "error";
  status?: string;
  sessionId?: string;
  data?: string;
  message?: string;
}

export default function ChatWidget() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");

  // WebSocket reference
  const wsRef = React.useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = React.useRef<number | null>(null);
  const chatIdRef = React.useRef<string>("");
  const aiMessageIdRef = React.useRef<string>("");
  const currentUserMessageRef = React.useRef<string>("");
  const accumulatedContentRef = React.useRef<string>("");

  // Get chat state from Redux
  const { currentChatId, sessions, isStreaming } = useAppSelector(
    (state) => state.rag
  );

  // Get messages directly from Redux
  const messages = React.useMemo(() => {
    const session = sessions[currentChatId];
    const msgs = session ? session.messages : [];
    return msgs;
  }, [sessions, currentChatId]);

  // Ref for auto scroll to latest message
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initialize chat session when widget opens
  React.useEffect(() => {
    if (isOpen && !chatIdRef.current) {
      const newChatId = generateChatId();
      chatIdRef.current = newChatId;
      dispatch(initializeChat(newChatId));
    }
  }, [isOpen, dispatch]);

  // WebSocket connection management
  const connectWebSocket = React.useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      const wsUrl = buildRagWebSocketUrl();
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        dispatch(setError(null));
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case "connection":
              console.log("Connection established:", message.sessionId);
              break;

            case "chunk":
              if (message.data && aiMessageIdRef.current) {
                // Accumulate content
                accumulatedContentRef.current += message.data;

                dispatch(
                  addOrUpdateAiMessage({
                    chatId: chatIdRef.current,
                    messageId: aiMessageIdRef.current,
                    content: accumulatedContentRef.current,
                    error: false,
                  })
                );
              }
              break;

            case "complete":
              console.log("Stream completed");
              dispatch(setStreaming(false));
              dispatch(setError(null));
              break;

            case "error": {
              console.error("WebSocket error:", message.message);
              const errorMessage = message.message || "Đã có lỗi xảy ra";

              dispatch(
                addOrUpdateAiMessage({
                  chatId: chatIdRef.current,
                  messageId: aiMessageIdRef.current,
                  content: errorMessage,
                  error: true,
                  retryData: {
                    message: currentUserMessageRef.current,
                    chatId: chatIdRef.current,
                  },
                })
              );

              dispatch(setStreaming(false));
              dispatch(setError(errorMessage));
              toast.error(errorMessage);
              break;
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        dispatch(setError("Lỗi kết nối WebSocket"));
        toast.error("Lỗi kết nối");
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        wsRef.current = null;

        // Auto-reconnect if widget is still open
        if (isOpen) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connectWebSocket();
          }, 3000);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      dispatch(setError("Không thể kết nối WebSocket"));
    }
  }, [isOpen, dispatch]);

  // Connect WebSocket when widget opens
  React.useEffect(() => {
    if (isOpen) {
      connectWebSocket();
    }

    return () => {
      // Cleanup on unmount or when widget closes
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen, connectWebSocket]);

  // Send message via WebSocket
  const handleSend = React.useCallback(
    (userInput?: string, messageId?: string) => {
      const inputToSend = userInput || input.trim();
      if (!inputToSend || isStreaming) return;

      const chatId = chatIdRef.current;

      if (!chatId) {
        toast.error("Chat session not initialized");
        return;
      }

      // Check WebSocket connection
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        toast.error("Chưa kết nối WebSocket. Đang thử kết nối lại...");
        connectWebSocket();
        return;
      }

      // Only add user message if this is a new message (not a retry)
      if (!userInput) {
        dispatch(addUserMessage({ chatId, content: inputToSend }));
        setInput("");
      }

      // Use provided messageId for retry or generate new one
      const currentMessageId = messageId || `${chatId}_ai_${Date.now()}`;
      aiMessageIdRef.current = currentMessageId;
      currentUserMessageRef.current = inputToSend;
      accumulatedContentRef.current = ""; // Reset accumulated content

      // Add an initial empty AI message so the UI shows the bubble while streaming
      dispatch(
        addOrUpdateAiMessage({
          chatId,
          messageId: currentMessageId,
          content: "",
          error: false,
        })
      );

      // Send message via WebSocket
      dispatch(setStreaming(true));
      wsRef.current.send(
        JSON.stringify({
          message: inputToSend,
          chatId: chatId,
        })
      );
    },
    [input, isStreaming, dispatch, connectWebSocket]
  );

  return (
    <TooltipProvider>
      <div className="p-2 sm:p-4 fixed bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 z-50 flex flex-col items-end gap-4 overflow-hidden max-w-[calc(100vw-2rem)]">
        {/* --- Chat Window --- */}
        {isOpen && (
          <Card
            className={cn(
              "w-full sm:w-[420px] md:w-[460px] h-[calc(100vh-120px)] max-h-[740px] gap-0 p-0 shadow-2xl border-gray-200",
              "flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300"
            )}
          >
            <CardHeader className="p-5 border-b flex flex-row items-center justify-between bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-xl shadow-sm">
              <div className="flex items-center gap-3">
                <ChatbotAvatar className="bg-white w-11 h-11 ring-2" />
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">Trợ lý ảo Aurora</CardTitle>
                  <span className="text-xs text-primary-foreground/90 flex items-center gap-1.5 mt-0.5">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        wsRef.current?.readyState === WebSocket.OPEN
                          ? "bg-green-300 animate-pulse shadow-sm shadow-green-400"
                          : "bg-gray-300"
                      )}
                    ></span>
                    <span className="font-medium">
                      {wsRef.current?.readyState === WebSocket.OPEN
                        ? "Đang hoạt động"
                        : "Ngoại tuyến"}
                    </span>
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X size={28} />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 h-full p-0 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col justify-center items-center gap-3 my-6 mx-6 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                    <span className="block text-center text-base font-semibold text-gray-700">
                      👋 Xin chào! Tôi là Aurora
                    </span>
                    <span className="text-center text-sm text-gray-600 leading-relaxed">
                      Bắt đầu trò chuyện nhanh với Trợ lý ảo Aurora
                    </span>
                    <span className="text-center text-xs text-gray-500 leading-relaxed">
                      🔒 Thông tin của bạn được ẩn và tin nhắn trò chuyện chỉ lưu
                      trên trình duyệt web.
                    </span>
                  </div>
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      isLoading={isStreaming}
                      message={msg}
                      onRetry={handleSend}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="p-4 rounded-b-2xl border-t bg-white/80 backdrop-blur-sm">
              <form
                className="flex w-full items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <Input
                  placeholder="Nhập tin nhắn của bạn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isStreaming}
                  className={cn(
                    "bg-gray-100 border border-gray-200 shadow-sm text-sm pl-4 py-5 rounded-xl",
                    "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                    "transition-all placeholder:text-gray-400"
                  )}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isStreaming || !input.trim()}
                  className="shrink-0 h-10 w-10 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Send size={18} />
                </Button>
              </form>
            </CardFooter>
          </Card>
        )}

        <ChatBubble isOpen={isOpen} handleOpen={setIsOpen} />
      </div>
    </TooltipProvider>
  );
}
