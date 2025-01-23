import React, { useEffect, useState } from "react";
import { Table, Button, Skeleton, Empty, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useAuth } from "../../Context/useContext";
import { toast } from "react-toastify";

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
        console.error("Error fetching files:", error);
        toast.error("An error occurred while fetching files.");
      } finally {
        setLoading(false);
      }
    };
    if(token){
      fetchFiles();
    }
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
      console.error("Error downloading file:", error);
      toast.error("An error occurred while downloading the file.");
    } finally {
      setLoadingDownload(null);
    }
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="text-gray-800 font-semibold text-sm sm:text-base">{name}</span>
      ),
    },
    {
      title: "Date and Time",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <span className="text-gray-500 text-sm sm:text-base">{date}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${status === "processed"
              ? "bg-green-200 text-green-800"
              : status === "in process"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-red-200 text-red-800"
            }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: File) => (
        <Button
          type="link"
          icon={<DownloadOutlined />}
          disabled={record.status !== "processed" || loadingDownload === record.fileId}
          onClick={() => downloadFile(record.fileId, record.name)}
          className="text-blue-600 hover:text-blue-800"
        >
          {loadingDownload === record.fileId ? <Spin size="small" /> : "Download"}
        </Button>
      ),
    },
  ];

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-2 px-40">
      <div className="w-full max-w-4xl p-10 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 text-center mb-6">
          Document Table {isHome ? "Overview" : ""}
        </h2>
        <Table
          dataSource={loading ? [] : files}
          columns={columns}
          pagination={{ pageSize: 5 }}
          className="rounded-lg overflow-hidden"
          locale={{
            emptyText: loading ? (
              <div className="flex items-center justify-center">
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            ) : (
              <Empty description="No files found" />
            ),
          }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default FileList;


