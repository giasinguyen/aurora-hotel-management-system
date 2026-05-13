import { getApiBaseUrl } from "@/config/api";

/**
 * Build WebSocket URL for RAG streaming
 * @returns WebSocket URL
 */
export const buildRagWebSocketUrl = (): string => {
  const API_BASE_URL = getApiBaseUrl();
  const wsProtocol = API_BASE_URL.startsWith("https") ? "wss" : "ws";
  const url = API_BASE_URL.replace(/^https?/, wsProtocol);
  return `${url}/ws/rag/stream`;
};

/**
 * Generate a unique chat ID
 */
export const generateChatId = (): string => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
