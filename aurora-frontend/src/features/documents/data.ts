export type DocumentViewMode = "grid" | "list"

export type DocumentItem = {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  owner: string;
  size: string;
  updatedAt: string;
  url: string;
  starred?: boolean;
  description: string;
};