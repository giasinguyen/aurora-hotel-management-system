import axiosClient from "@/config/axiosClient";
import type { ApiResponse } from "@/types/apiResponse";

export interface GalleryImage {
  imageUrl: string;
  sourceType: "ROOM" | "SERVICE";
  sourceId: string;
  sourceName: string;
}

export const galleryApi = {
  getImages: async (maxImages: number = 24): Promise<ApiResponse<GalleryImage[]>> => {
    const response = await axiosClient.get<ApiResponse<GalleryImage[]>>(
      `/api/v1/gallery/images?maxImages=${maxImages}`
    );
    return response.data;
  },
};

