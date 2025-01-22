import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/useContext";
import { Spin, Select } from "antd";
import { io } from "socket.io-client";

const { Option } = Select;

interface UploadFormProps {
  onUploadComplete: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadComplete }) => {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [activePayment, setActivePayment] = useState<any[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectLoading, setSelectLoading] = useState<boolean>(false);

  const Base_Url =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://daizyexserver.vercel.app";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const WEB_SOCKET_OI_LIVE_URL = "https://websocket-oideizy.onrender.com";

  // Socket connection for real-time updates
  useEffect(() => {
    fetchActivePlans();
    const socket = io(WEB_SOCKET_OI_LIVE_URL, { transports: ["websocket"] });

    // Listen for the 'activePlansUpdated' event to update the payment plans
    socket.on("activePlansUpdated", (data) => {
      if (data.activePlan) {
        setActivePayment(data.payments);
      } else {
        setActivePayment([]);
        onUploadComplete(); // Trigger the callback after upload
      }
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [WEB_SOCKET_OI_LIVE_URL]);

  const fetchActivePlans = async () => {
    setSelectLoading(true);
    try {
      const response = await fetch(`${Base_Url}/api/payment/active-plans`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });

      const data = await response.json();
      if (response.ok && Array.isArray(data.payments)) {
        setActivePayment(data.payments);
      } else {
        setActivePayment([]); // Handle empty response or incorrect structure
        toast.warn("No active plans found.");
      }
    } catch (error) {
      console.error("Error fetching active payments:", error);
      toast.error("Failed to fetch active plans.");
      setActivePayment([]); // Ensure activePayment is empty on error
    } finally {
      setSelectLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchActivePlans();
    }
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !file || !selectedPaymentId) {
      toast.error("Please provide a name, upload a file, and select a payment.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);
    formData.append("paymentId", selectedPaymentId);

    setLoading(true);

    try {
      const response = await fetch(`${Base_Url}/api/files/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token || ""}` },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "File uploaded successfully.");
        fetchActivePlans(); // Re-fetch active plans after upload
        onUploadComplete(); // Trigger the callback after upload
      } else {
        toast.error(result.message || "Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }

    // Clear input fields after submission
    setName("");
    setFile(null);
    setSelectedPaymentId("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ marginTop: "3rem" }} className="flex items-center justify-center max-h-screen w-full">
      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "5rem" }}
        className="w-full max-w-[450px] bg-white p-4 rounded-lg shadow-md h-auto bg-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-16">Upload A Document</h2>

        <div className="mb-10">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter Name of File"
          />
        </div>

        <div className="mb-10">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mt-1 block w-full text-sm text-gray-500"
            required
          />
        </div>

        <div className="mb-10">
          <label htmlFor="payment" className="block text-sm font-medium text-gray-700">Select Active Plan</label>
          <Select
            id="payment"
            placeholder={selectLoading ? "Loading..." : "Select Active Plan"}
            className="w-full"
            value={selectedPaymentId || undefined}
            onChange={(value) => setSelectedPaymentId(value)}
            disabled={selectLoading}
          >
            {selectLoading ? (
              <Option disabled>
                <Spin size="small" />
              </Option>
            ) : (
              activePayment?.map((payment) => (
                <Option key={payment._id} value={payment._id}>
                  {payment.serviceType} - ${payment.totalPrice}
                </Option>
              ))
            )}
            {!selectLoading && activePayment.length === 0 && (
              <Option disabled>No active plans available</Option>
            )}
          </Select>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md ${loading || !name || !file || !selectedPaymentId
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500 text-white"
            }`}
          disabled={loading || !name || !file || !selectedPaymentId}
        >
          {loading ? <Spin size="small" /> : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
