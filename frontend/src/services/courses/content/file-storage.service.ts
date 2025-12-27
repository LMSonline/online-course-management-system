import { axiosClient } from "@/lib/api/axios";
import { unwrapResponse } from "@/lib/api/unwrap";
import { ApiResponse } from "@/lib/api/api.types";
import { FileStorageResponse, StorageProvider } from "./file-storage.types";

export const fileStorageService = {
  /**
   * Upload file
   */
  uploadFile: async (
    file: File,
    folderPath?: string,
    storageProvider?: StorageProvider
  ): Promise<FileStorageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    if (folderPath) formData.append("folderPath", folderPath);
    if (storageProvider) formData.append("storageProvider", storageProvider);

    const response = await axiosClient.post<ApiResponse<FileStorageResponse>>(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Get file details
   */
  getFileStorage: async (id: number): Promise<FileStorageResponse> => {
    const response = await axiosClient.get<ApiResponse<FileStorageResponse>>(
      `/files/${id}`
    );

    return unwrapResponse(response);
  },

  /**
   * Get download URL
   */
  getDownloadUrl: async (
    id: number,
    expirySeconds: number = 3600
  ): Promise<string> => {
    const response = await axiosClient.get<
      ApiResponse<{ downloadUrl: string }>
    >(`/files/${id}/download`, {
      params: { expirySeconds },
    });

    const data = unwrapResponse(response);
    return data.downloadUrl;
  },

  /**
   * Get file with download URL
   */
  getFileStorageWithDownloadUrl: async (
    id: number,
    expirySeconds: number = 3600
  ): Promise<FileStorageResponse> => {
    const response = await axiosClient.get<ApiResponse<FileStorageResponse>>(
      `/files/${id}/details`,
      {
        params: { expirySeconds },
      }
    );

    return unwrapResponse(response);
  },

  /**
   * Delete file (Teacher or Admin only)
   */
  deleteFile: async (id: number): Promise<void> => {
    await axiosClient.delete<void>(`/files/${id}`);
  },
};
