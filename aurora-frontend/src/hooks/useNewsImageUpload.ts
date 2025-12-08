import { useState, useCallback, useRef } from 'react';
import { uploadNewsImage, deleteImageByPublicId, type ImageAssetResponse } from '@/services/newsApi';
import { toast } from 'sonner';

/**
 * Temporary image state before upload to Cloudinary
 */
interface TempImage {
  tempUrl: string; // ObjectURL for preview
  file: File;
  uploading?: boolean;
  cloudinaryUrl?: string; // URL after upload
  publicId?: string; // Cloudinary public ID
  error?: string;
}

/**
 * Hook to manage news images with temporary local storage and Cloudinary upload
 * 
 * Flow:
 * 1. User uploads image → create ObjectURL → show in editor immediately
 * 2. Store temp images in state with their ObjectURLs
 * 3. When Save button clicked → upload all temp images to Cloudinary
 * 4. Replace temp URLs with Cloudinary URLs in content
 * 5. Cleanup: revoke ObjectURLs and delete unused images
 */
export const useNewsImageUpload = () => {
  // Map: tempUrl -> TempImage
  const [tempImages, setTempImages] = useState<Map<string, TempImage>>(new Map());
  
  // Track uploaded images (from existing news or newly uploaded)
  const [uploadedImages, setUploadedImages] = useState<ImageAssetResponse[]>([]);
  
  // Track images to delete on save
  const deleteQueue = useRef<string[]>([]); // Array of publicIds
  
  /**
   * Create temporary image from File
   * Returns ObjectURL that can be used immediately in editor
   */
  const createTempImage = useCallback((file: File): string => {
    const tempUrl = URL.createObjectURL(file);
    
    setTempImages(prev => {
      const newMap = new Map(prev);
      newMap.set(tempUrl, {
        tempUrl,
        file,
        uploading: false,
      });
      return newMap;
    });
    
    return tempUrl;
  }, []);
  
  /**
   * Upload a single temp image to Cloudinary
   */
  const uploadSingleImage = useCallback(async (
    tempUrl: string,
    targetNewsId: string
  ): Promise<string | null> => {
    const tempImage = tempImages.get(tempUrl);
    if (!tempImage || tempImage.cloudinaryUrl) {
      return tempImage?.cloudinaryUrl || null;
    }
    
    // Mark as uploading
    setTempImages(prev => {
      const newMap = new Map(prev);
      const img = newMap.get(tempUrl);
      if (img) {
        img.uploading = true;
        newMap.set(tempUrl, { ...img });
      }
      return newMap;
    });
    
    try {
      const response = await uploadNewsImage(targetNewsId, tempImage.file);
      const imageAsset = response.result;
      
      // Update temp image with Cloudinary URL
      setTempImages(prev => {
        const newMap = new Map(prev);
        const img = newMap.get(tempUrl);
        if (img) {
          img.uploading = false;
          img.cloudinaryUrl = imageAsset.url;
          img.publicId = imageAsset.publicId;
          newMap.set(tempUrl, { ...img });
        }
        return newMap;
      });
      
      // Add to uploaded images
      setUploadedImages(prev => [...prev, imageAsset]);
      
      return imageAsset.url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      
      setTempImages(prev => {
        const newMap = new Map(prev);
        const img = newMap.get(tempUrl);
        if (img) {
          img.uploading = false;
          img.error = 'Upload failed';
          newMap.set(tempUrl, { ...img });
        }
        return newMap;
      });
      
      throw error;
    }
  }, [tempImages]);
  
  /**
   * Upload all temp images to Cloudinary
   * Returns map of tempUrl -> cloudinaryUrl
   */
  const uploadAllTempImages = useCallback(async (
    targetNewsId: string
  ): Promise<Map<string, string>> => {
    const urlMap = new Map<string, string>();
    const uploadPromises: Promise<void>[] = [];
    
    for (const [tempUrl, tempImage] of tempImages.entries()) {
      // Skip if already uploaded
      if (tempImage.cloudinaryUrl) {
        urlMap.set(tempUrl, tempImage.cloudinaryUrl);
        continue;
      }
      
      const promise = uploadSingleImage(tempUrl, targetNewsId)
        .then(cloudinaryUrl => {
          if (cloudinaryUrl) {
            urlMap.set(tempUrl, cloudinaryUrl);
          }
        })
        .catch(error => {
          console.error(`Failed to upload ${tempUrl}:`, error);
          toast.error(`Không thể upload ảnh: ${tempImage.file.name}`);
        });
      
      uploadPromises.push(promise);
    }
    
    await Promise.all(uploadPromises);
    return urlMap;
  }, [tempImages, uploadSingleImage]);
  
  /**
   * Replace all temp URLs in HTML content with Cloudinary URLs
   */
  const replaceUrlsInContent = useCallback((
    html: string,
    urlMap: Map<string, string>
  ): string => {
    let updatedHtml = html;
    
    for (const [tempUrl, cloudinaryUrl] of urlMap.entries()) {
      // Replace in src attributes
      updatedHtml = updatedHtml.replace(
        new RegExp(escapeRegExp(tempUrl), 'g'),
        cloudinaryUrl
      );
    }
    
    return updatedHtml;
  }, []);
  
  /**
   * Mark image for deletion (will be deleted on save)
   */
  const markImageForDeletion = useCallback((publicId: string) => {
    if (!deleteQueue.current.includes(publicId)) {
      deleteQueue.current.push(publicId);
    }
  }, []);
  
  /**
   * Detect deleted images by comparing current content with uploaded images
   */
  const detectDeletedImages = useCallback((currentHtml: string): string[] => {
    const deletedPublicIds: string[] = [];
    
    for (const image of uploadedImages) {
      // Check if image URL exists in current content
      if (!currentHtml.includes(image.url)) {
        deletedPublicIds.push(image.publicId);
      }
    }
    
    return deletedPublicIds;
  }, [uploadedImages]);
  
  /**
   * Delete images from Cloudinary
   */
  const deleteImages = useCallback(async (publicIds: string[]) => {
    const deletePromises = publicIds.map(async (publicId) => {
      try {
        await deleteImageByPublicId(publicId);
        console.log(`Deleted image: ${publicId}`);
      } catch (error) {
        console.error(`Failed to delete image ${publicId}:`, error);
      }
    });
    
    await Promise.all(deletePromises);
  }, []);
  
  /**
   * Cleanup: revoke ObjectURLs and delete queued images
   */
  const cleanup = useCallback(async () => {
    // Revoke all ObjectURLs
    for (const [tempUrl] of tempImages.entries()) {
      URL.revokeObjectURL(tempUrl);
    }
    
    // Delete queued images from Cloudinary
    if (deleteQueue.current.length > 0) {
      await deleteImages(deleteQueue.current);
      deleteQueue.current = [];
    }
    
    // Clear state
    setTempImages(new Map());
  }, [tempImages, deleteImages]);
  
  /**
   * Initialize uploaded images from existing news
   */
  const initializeUploadedImages = useCallback((images: ImageAssetResponse[]) => {
    setUploadedImages(images);
  }, []);
  
  /**
   * Main save flow:
   * 1. Upload all temp images
   * 2. Replace URLs in content
   * 3. Detect and delete removed images
   * 4. Cleanup temp resources
   */
  const processSave = useCallback(async (
    htmlContent: string,
    targetNewsId: string
  ): Promise<string> => {
    try {
      // Step 1: Upload all temp images
      const urlMap = await uploadAllTempImages(targetNewsId);
      
      // Step 2: Replace temp URLs with Cloudinary URLs
      const updatedHtml = replaceUrlsInContent(htmlContent, urlMap);
      
      // Step 3: Detect deleted images
      const deletedPublicIds = detectDeletedImages(updatedHtml);
      
      // Add to delete queue
      deletedPublicIds.forEach(publicId => markImageForDeletion(publicId));
      
      // Step 4: Delete removed images
      if (deleteQueue.current.length > 0) {
        await deleteImages(deleteQueue.current);
        deleteQueue.current = [];
      }
      
      // Step 5: Cleanup temp resources
      await cleanup();
      
      return updatedHtml;
    } catch (error) {
      console.error('Failed to process save:', error);
      throw error;
    }
  }, [
    uploadAllTempImages,
    replaceUrlsInContent,
    detectDeletedImages,
    markImageForDeletion,
    deleteImages,
    cleanup,
  ]);
  
  return {
    // State
    tempImages,
    uploadedImages,
    
    // Actions
    createTempImage,
    uploadSingleImage,
    uploadAllTempImages,
    replaceUrlsInContent,
    markImageForDeletion,
    detectDeletedImages,
    deleteImages,
    cleanup,
    initializeUploadedImages,
    processSave,
  };
};

// Helper function to escape special regex characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
