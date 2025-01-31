import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/useContext";
import { Skeleton, Spin, Select, Modal } from "antd";
import "../../index.css"

const { Option } = Select;

interface BookingDetails {
  recipientName: string;
  serviceAddress: string;
  city: string;
  state: string;
  zipCode: string;
  additionalAddresses?: {
    recipientName?: string;
    serviceAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  preferredServiceDate: Date;
  preferredTime?: string;
}


interface PaymentDetails {
  serviceType: string;
  totalPrice: string;
  addOns: string | [];
  paymentMethod: string;
  bookingDetails: BookingDetails;
  PayedAt: Date;
}

interface File {
  _id: string;
  fileName: string;
  uploadedAt: string;
  status: string;
  statusInProgressTime?: Date;  // Add this
  timeFrame?: string;
  statusProcessedTime?: Date;  // Add this
  processedTimeFrame?: string;
  paymentId: PaymentDetails;
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

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://daizyexserver.vercel.app";

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

  useEffect(() => {
    fetchUserFiles();
  }, [id, token, API_BASE_URL])


  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      setIsDownloading(fileId);
      const response = await fetch(`${API_BASE_URL}/api/admin/files/${fileId}/download`, {
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

        await fetchUserFiles();

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
    formData.append("file", uploadedFile as unknown as Blob);

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
            {loading
              ? Array.from({ length: Math.max(1, files.length) }).map((_, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Input active size="small" style={{ width: "30px" }} />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Input active size="small" style={{ width: "120px" }} />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Input active size="small" style={{ width: "90px" }} />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Input active size="small" style={{ width: "80px" }} />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Button active size="small" style={{ width: "100px" }} />
                  </td>
                </tr>
              ))
              : filteredFiles.length > 0 ? (
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
                  <td colSpan={6} className="px-4 py-2 text-center border border-gray-300">
                    No documents found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Payment Details Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h2>
        {filteredFiles.length > 0 && filteredFiles.map((file) => (
          <div key={file._id} className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
            {file.paymentId ? (
              <>
                {/* File Name Label */}
                <div className="flex justify-between items-center mb-4 gap-4">
                  <div className="font-semibold text-10px">Payment for: {file.fileName}</div>
                  <div className="flex items-center gap-2">
                    {statusLoading.has(file._id) ? (
                      <div className="flex items-center gap-2">
                        <Skeleton.Input active size="small" style={{ width: 100 }} />
                        <Skeleton.Input active size="small" style={{ width: 120 }} />
                      </div>
                    ) : (
                      <>
                        {/* Always show processing timeframe if it exists */}
                        {file.timeFrame && file.status !== 'not processed' && (
                          <div className="flex items-center gap-2">
                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                              {file.timeFrame === 'saturday'
                                ? 'Saturday Process'
                                : `${file.timeFrame} Shift`}
                            </span>
                            {file.statusInProgressTime && (
                              <span className="text-gray-600 text-sm">
                                {new Date(file.statusInProgressTime).toLocaleDateString('en-GB')}
                                <span className="mx-1">•</span>
                                {new Date(file.statusInProgressTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Show completion timeframe only for processed status */}
                        {file.status === 'processed' && file.processedTimeFrame && (
                          <div className="flex items-center gap-2">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              {file.processedTimeFrame === 'saturday'
                                ? 'Saturday Completion'
                                : `${file.processedTimeFrame} Completion`}
                            </span>
                            {file.statusProcessedTime && (
                              <span className="text-gray-600 text-sm">
                                {new Date(file.statusProcessedTime).toLocaleDateString('en-GB')}
                                <span className="mx-1">•</span>
                                {new Date(file.statusProcessedTime).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <br />

                {/* Using Ant Design's Card Component for styling */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex-1">
                    <div className="font-semibold">Service Type:</div>
                    <div>{file.paymentId.serviceType}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Total Price:</div>
                    <div>${file.paymentId.totalPrice}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Add-Ons:</div>
                    <div>{Array.isArray(file.paymentId.addOns) ? file.paymentId.addOns.join(", ") : file.paymentId.addOns}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Payment Method:</div>
                    <div>{file.paymentId.paymentMethod}</div>
                  </div>
                </div>

                {/* Payment Address and Details */}
                <div className="mt-4 flex flex-wrap gap-6">
                  <div className="flex-1 p-4 ">
                    <div className="font-semibold">Booking Address:</div>
                    <div>Recipient: {file.paymentId.bookingDetails.recipientName}</div>
                    <div>Address: {file.paymentId.bookingDetails.serviceAddress}</div>
                    <div>City: {file.paymentId.bookingDetails.city}</div>
                    <div>State: {file.paymentId.bookingDetails.state}</div>
                    <div>ZIP Code: {file.paymentId.bookingDetails.zipCode}</div>
                    <div>
                      <strong>Preferred Date: </strong>
                      {new Date(file.paymentId.bookingDetails.preferredServiceDate).toISOString().split('T')[0]}
                    </div>
                    <div><strong>Preferred Time:</strong> {file.paymentId.bookingDetails.preferredTime}</div>
                  </div>

                  {/* Additional Address (if available) */}
                  {file.paymentId.bookingDetails.additionalAddresses && (
                    <div className="flex-1 p-4  ">
                      <div className="font-semibold">Additional Address:</div>
                      <div>Recipient: {file.paymentId.bookingDetails.additionalAddresses.recipientName || "N/A"}</div>
                      <div>Address: {file.paymentId.bookingDetails.additionalAddresses.serviceAddress || "N/A"}</div>
                      <div>City: {file.paymentId.bookingDetails.additionalAddresses.city || "N/A"}</div>
                      <div>State: {file.paymentId.bookingDetails.additionalAddresses.state || "N/A"}</div>
                      <div>ZIP Code: {file.paymentId.bookingDetails.additionalAddresses.zipCode || "N/A"}</div>
                    </div>
                  )}

                </div>


                {/* Payment Date with Time */}
                <div className="mt-4">
                  <div className="font-semibold">Payment Date:</div>
                  <div>
                    {new Date(file.paymentId.PayedAt).toLocaleDateString("en-GB")},
                    Time {new Date(file.paymentId.PayedAt).toLocaleTimeString("en-GB", { hour12: true })}
                  </div>
                </div>

              </>
            ) : (
              <span>No Payment Details</span>
            )}
          </div>
        ))}
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


