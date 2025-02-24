import React, { useState } from "react";
import { Modal, Button, Skeleton, Timeline, Empty } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useFiles, File as FileType } from "../../Hooks/useUserFile";

interface FileListProps {
  isHome: boolean;
}

const FileList: React.FC<FileListProps> = ({ isHome }) => {
  const { files, loading, loadingDownload, downloadFile, initiatePayment, isPaymentProcessing } = useFiles();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  // Open modal and set the currently selected file.
  const openModal = (file: FileType) => {
    setSelectedFile(file);
    setModalVisible(true);
  };

  // Close modal and clear selected file.
  const closeModal = () => {
    setModalVisible(false);
    setSelectedFile(null);
  };

  const renderAttempts = (attempts: string) => {
    if (attempts === "not attempted") {
      return "not attempted";
    } else if (attempts === "attempted 3") {
      return "Attempts completed";
    } else {
      return "attempts on progress";
    }
  };

  // Render Final Stage: only show "Completed" when the status is processed.
  const renderFinalStage = (status: string) => {
    return status === "processed" ? "Completed" : "";
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* Global Loader at the top if any payment is processing */}
      
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
                <th className="px-4 py-3 text-left">Pay Now</th>
                <th className="px-4 py-3 text-left">Track File</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">
                      <Skeleton.Input active size="small" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton.Input active size="small" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton.Input active size="small" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton.Button active size="small" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton.Button active size="small" />
                    </td>
                  </tr>
                ))
              ) : files.length === 0 ? (
                // Show Empty state when no files are available
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    <Empty description="No Documents Found" />
                  </td>
                </tr>
              ) : (
                files.map((file) => (
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
                          file.status !== "processed" || 
                          !file.hasBeenReplaced || !file.activePlan ||
                          loadingDownload === file.fileId
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-800"
                        }`}
                        onClick={() => downloadFile(file.fileId, file.name)}
                        disabled={
                          file.status !== "processed" ||
                          !file.hasBeenReplaced || 
                          loadingDownload === file.fileId
                        }
                      >
                        <DownloadOutlined className="mr-1" />
                        {loadingDownload === file.fileId ? (
                          <Skeleton.Input
                            active
                            size="small"
                            style={{
                              width: 70,
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : (
                          "Download"
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="primary"
                        disabled={file.status !== "processed" || file.activePlan}
                        loading={isPaymentProcessing === file.fileId}
                        onClick={() => initiatePayment(file)}
                      >
                        {file.activePlan
                          ? "Payed"
                          : isPaymentProcessing === file.fileId
                          ? "Redirecting..."
                          : "Make Payment"}
                      </Button>
                    </td>
                    <td className="px-4 py-3">
                      <Button type="dashed" onClick={() => openModal(file)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to display file details in a connected timeline */}
      <Modal
        open={modalVisible}
        title="File Details"
        onCancel={closeModal}
        footer={[
          <Button key="close" type="default" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        {selectedFile && (
          <div className="p-4">
            <Timeline mode="left">
              <Timeline.Item color="blue">
                <strong>File Name:</strong> {selectedFile.name}
              </Timeline.Item>
              <Timeline.Item color="green">
                <strong>Status:</strong> {selectedFile.status}
              </Timeline.Item>
              <Timeline.Item color="orange">
                <strong>Attempts:</strong> {renderAttempts(selectedFile.attempts)}
              </Timeline.Item>
              <Timeline.Item color="purple">
                <strong>Final Stage:</strong>{" "}
                {renderFinalStage(selectedFile.status) || "Not Completed"}
              </Timeline.Item>
            </Timeline>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FileList;

