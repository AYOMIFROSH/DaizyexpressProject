import React, { useEffect, useState} from "react";
import { useAuth } from "../../Context/useContext";
import { toast } from "react-toastify";
import { DownloadOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";

interface File {
  key: string;
  name: string;
  date: string;
  status: string;
  fileId: string;
}

interface FileListProps {
  isHome: boolean;
}

const FileList: React.FC<FileListProps> = ({ isHome }) => {
  const { token } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDownload, setLoadingDownload] = useState<string | null>(null);
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://daizyexserver.vercel.app";

  useEffect(() => {
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

    if (token) fetchFiles();
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

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-5xl">
        <h4 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center p-4 border-b">
          Document Table {isHome ? "Overview" : ""}
        </h4>
        <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-lg">
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm border-b">
                <th className="px-4 py-3 text-left">File Name</th>
                <th className="px-4 py-3 text-left">Date and Time</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3"><Skeleton.Input active size="small" /></td>
                      <td className="px-4 py-3"><Skeleton.Input active size="small" /></td>
                      <td className="px-4 py-3"><Skeleton.Input active size="small" /></td>
                      <td className="px-4 py-3"><Skeleton.Button active size="small" /></td>
                    </tr>
                  ))
                : files.map((file) => (
                    <tr key={file.key} className="border-b">
                      <td className="px-4 py-3 text-gray-800 font-semibold truncate">
                        {file.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{file.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            file.status === "processed"
                              ? "bg-green-100 text-green-800"
                              : file.status === "in process"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {file.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className={`flex items-center ${
                            file.status !== "processed" || loadingDownload === file.fileId
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 hover:text-blue-800"
                          }`}
                          onClick={() => downloadFile(file.fileId, file.name)}
                          disabled={file.status !== "processed" || loadingDownload === file.fileId}
                        >
                          <DownloadOutlined className="mr-1" />
                          {loadingDownload === file.fileId ? (
                            <Skeleton.Input 
                              active 
                              size="small" 
                              style={{ 
                                width: 70, 
                                display: 'inline-block',
                                verticalAlign: 'middle'
                              }} 
                            />
                          ) : (
                            "Download"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileList;