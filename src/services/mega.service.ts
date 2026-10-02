import api from "./api";
import { MegaItem } from "@/types/mega";

export const getFolder = async (nodeId: string): Promise<MegaItem[]> => {
  const response = await api.get(`/mega/folders/${nodeId}`);
  return response.data;
};

export const downloadFile = async (nodeId: string, fileName: string) => {
  const response = await api.get(`/mega/download/${nodeId}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Descarga en formato ArrayBuffer explícito para librerías de lectura binaria
export const fetchFileArrayBuffer = async (
  nodeId: string,
): Promise<ArrayBuffer> => {
  const response = await api.get(`/mega/file-buffer/${nodeId}`, {
    responseType: "arraybuffer",
  });
  return response.data;
};

// Subida y actualización
export const uploadFileToMega = async (
  file: File,
  folderId: string,
  replaceNodeId?: string,
): Promise<MegaItem> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folderId", folderId);
  if (replaceNodeId) {
    formData.append("replaceNodeId", replaceNodeId);
  }

  const response = await api.post("/mega/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteMegaItem = async (nodeId: string): Promise<void> => {
  await api.delete(`/mega/${nodeId}`);
};
