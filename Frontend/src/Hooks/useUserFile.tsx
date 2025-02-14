import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../Context/useContext";

export interface File {
  key: string;
  name: string;
  date: string;
  status: string;
  attempts: string,
  hasBeenReplaced: boolean,
  fileId: string;
}

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://daizyexserver.vercel.app";

export const useFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDownload, setLoadingDownload] = useState<string | null>(null);
  const {token } = useAuth();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/files/user-files`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedFiles = data.files.map((file: any, index: number) => ({
          key: String(index + 1),
          name: file.fileName,
          date: new Date(file.uploadedAt).toLocaleString(),
          status: file.status,
          attempts: file.attempts,
          hasBeenReplaced: file.hasBeenReplaced,
          fileId: file._id,
        }));
        setFiles(formattedFiles);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to fetch files.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const downloadFile = async (fileId: string, name: string) => {
    try {
      setLoadingDownload(fileId);
      const response = await fetch(`${API_BASE_URL}/api/files/download/${fileId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to download file.");
      }
    } catch (error) {
      toast.error("An error occurred while downloading the file.");
    } finally {
      setLoadingDownload(null);
    }
  };

  return { files, loading, loadingDownload, fetchFiles, downloadFile };
};
