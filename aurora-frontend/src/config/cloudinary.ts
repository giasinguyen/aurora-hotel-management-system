// ============================================
// Cloudinary Configuration & Upload Utility
// ============================================

import axiosClient from './axiosClient';

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqmlxcbxt',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'aurora_hotel',
};

/**
 * Upload image to Cloudinary via Backend API
 * @param file - File to upload
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with uploaded image URL
 */
export async function uploadToCloudinary(
  file: File,
  folder?: string
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use backend API endpoint
    const params = new URLSearchParams();
    if (folder) {
      params.append('folder', folder);
    }
    
    const response = await axiosClient.post(
      `/api/v1/cloudinary/upload${params.toString() ? '?' + params.toString() : ''}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data?.result?.url) {
      return response.data.result.url;
    }
    
    throw new Error('Upload response does not contain URL');
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to upload image'
    );
  }
}

/**
 * Upload multiple images to Cloudinary via Backend API
 * @param files - Array of files to upload
 * @param folder - Optional folder name in Cloudinary
 * @returns Promise with array of uploaded image URLs
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder?: string
): Promise<string[]> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    const params = new URLSearchParams();
    if (folder) {
      params.append('folder', folder);
    }
    
    const response = await axiosClient.post(
      `/api/v1/cloudinary/upload-multiple${params.toString() ? '?' + params.toString() : ''}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Extract URLs from response
    const results = response.data?.result;
    if (!results) {
      throw new Error('Upload response invalid');
    }

    const urls: string[] = [];
    for (const [filename, result] of Object.entries(results)) {
      if (filename !== 'summary' && typeof result === 'object') {
        const resultObj = result as { status: string; url?: string };
        if (resultObj.status === 'success' && resultObj.url) {
          urls.push(resultObj.url);
        }
      }
    }

    if (urls.length === 0) {
      throw new Error('No files uploaded successfully');
    }

    return urls;
  } catch (error: any) {
    console.error('Cloudinary multiple upload error:', error);
    throw new Error(
      error.response?.data?.message || error.message || 'Failed to upload images'
    );
  }
}
