import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/useContext";
import { Spin } from "antd";

interface UploadFormProps {
  paymentId: string | null;
  onUploadComplete: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ paymentId, onUploadComplete }) => {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const Base_Url =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://daizyexserver.vercel.app";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // If a paymentId is passed from the parent, use it.
  useEffect(() => {
    if (paymentId) {
      setSelectedPaymentId(paymentId);
    }
  }, [paymentId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !file || !selectedPaymentId) {
      toast.error("Please provide a name, upload a file, and ensure a valid payment is selected.");
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
        // Call onUploadComplete to trigger the parent to recheck active payments and redirect.
        onUploadComplete();
      } else {
        toast.error(result.message || "Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }

    // Clear form inputs after submission
    setName("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ marginTop: "3rem" }} className="flex items-center justify-center max-h-screen w-full">
      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "5rem" }}
        className="w-full max-w-[450px] p-4 rounded-lg shadow-md h-auto bg-gray-100"
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

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md ${
            loading || !name || !file || !selectedPaymentId
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

