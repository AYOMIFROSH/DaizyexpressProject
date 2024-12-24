import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/useContext";
import { Skeleton, Spin, Select, Modal } from "antd";

const { Option } = Select;

interface File {
  _id: string;
  fileName: string;
  uploadedAt: string;
  status: string;
}

const UserDocuments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState("");
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState<Set<string>>(new Set());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false); 

  const API_BASE_URL = "https://daizyexserver.vercel.app";

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.status === "success") {
          setFiles(result.data.files);
        } else {
          toast.error(`Error fetching files: ${result.message}`);
        }
      } catch (error) {
        toast.error("Error fetching files. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserFiles();
  }, [id, token, API_BASE_URL]);

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      setIsDownloading(fileId);
      const response = await fetch(`${API_BASE_URL}/api/admin/files/download/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        toast.error("Error downloading file.");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error downloading file. Please try again later.");
    } finally {
      setIsDownloading(null);
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file as unknown as File); 
      console.log("Selected file:", file);
    }
  };

  const handleStatusChange = async (fileId: string, newStatus: string) => {
    try {
      setStatusLoading((prev) => new Set(prev.add(fileId)));
      const response = await fetch(`${API_BASE_URL}/api/admin/files/${fileId}/update-status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (result.status === "success") {
        toast.success("Status updated successfully!");
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file._id === fileId ? { ...file, status: newStatus } : file
          )
        );

        if (newStatus === "processed") {
          setSelectedFileId(fileId);
          setIsModalVisible(true);
        }
      } else {
        toast.error(`Failed to update status: ${result.message}`);
      }
    } catch (error) {
      toast.error("Error updating status. Please try again later.");
    } finally {
      setStatusLoading((prev) => {
        const updated = new Set(prev);
        updated.delete(fileId);
        return updated;
      });
    }
  };

  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFile || !selectedFileId) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile as unknown as Blob); // Correct handling of file data

    try {
      setUploading(true); // Start the spinner
      const response = await fetch(`${API_BASE_URL}/api/admin/files/${selectedFileId}/replace`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.status === "success") {
        toast.success("File updated successfully!");
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file._id === selectedFileId ? { ...file, fileName: result.file.fileName } : file
          )
        );
        setIsModalVisible(false);
        setUploadedFile(null);
        setSelectedFileId(null);
      } else {
        toast.error(`Failed to update file: ${result.message}`);
      }
    } catch (error) {
      toast.error("Error updating file. Please try again later.");
    } finally {
      setUploading(false); 
    }
  };

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen mt-12 sm:mt-16 lg:mt-20 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Documents</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-lg">
        <table className="w-full table-auto text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300">#</th>
              <th className="px-4 py-2 border border-gray-300">File Name</th>
              <th className="px-4 py-2 border border-gray-300">Date</th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={5} className="px-4 py-2 text-center">
                    <Skeleton.Input style={{ width: "100%" }} active />
                  </td>
                </tr>
              ))
            ) : filteredFiles.length > 0 ? (
              filteredFiles.map((file, index) => (
                <tr key={file._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                  <td className="px-4 py-2 border border-gray-300">{file.fileName}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {statusLoading.has(file._id) ? (
                      <Skeleton.Button active size="small" style={{ width: "80px" }} />
                    ) : (
                      <Select
                        defaultValue={file.status || "not processed"}
                        onChange={(value) => handleStatusChange(file._id, value)}
                      >
                        <Option value="not processed">Not Processed</Option>
                        <Option value="in process">In Process</Option>
                        <Option value="processed">Processed</Option>
                      </Select>
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => handleDownload(file._id, file.fileName)}
                      className="px-4 py-2 text-black bg-white-500 rounded-lg hover:bg-white-600 focus:outline-none"
                    >
                      {isDownloading === file._id ? (
                        <>
                          Download <Spin size="small" style={{ marginLeft: "8px" }} />
                        </>
                      ) : (
                        "Download"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center border border-gray-300">
                  No documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        title="Upload New Document"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmitUpload}
        okText={uploading ? "Uploading..." : "Upload"} 
        cancelText="Cancel"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
      </Modal>
    </div>
  );
};

export default UserDocuments;



