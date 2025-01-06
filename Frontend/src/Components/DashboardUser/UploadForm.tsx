import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/useContext";
import { Spin } from "antd";

const UploadForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const { token,setIsPayed,isPayed } = useAuth()
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const Base_Url =
    window.location.hostname === "localhost"
      ? "http://localhost:3000" // Localhost
      : "https://daizyexserver.vercel.app"; // 
      
    // Ref for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !file) {
      toast.error("Please provide a name and upload a file.");
      return;
    }
    //if (!hasPaid) {
      // If user has not paid, show the payment overlay
  
    //} 

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    setLoading(true); 

    try {
      const response = await fetch(`${Base_Url}/api/files/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token || ''}` },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "File uploaded successfully.");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred while uploading the file.");
    } finally {
      setLoading(false); 
    }

    // Clear input fields
    setName("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const showPaymentOverlay = () => {
    setIsPayed(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      {/* <PaymentForm onClose={closePaymentOverlay}/> */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] bg-white p-6 rounded-lg shadow-md h-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-16">
          Upload A Document
        </h2>

        {/* Name Field */}
        <div className="mb-10">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter Name of File"
          />
        </div>

        {/* File Upload Field */}
        <div className="mb-10">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Upload File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-gray-700
              hover:file:bg-blue-100"
            required
          />
        </div>

        {/* Submit Button */}
        {isPayed && <button
          type="submit"
          className="w-full bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-offset-2"
          disabled={loading} 
        >
          {loading ? <Spin size="small" /> : "Upload"} 
        </button>}

       {!isPayed && <button
          type="submit"
          onClick={showPaymentOverlay}
          className="w-full bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-offset-2"
          disabled={loading} 
        >
          { "Pay"} 
        </button>}
      </form>
    </div>
  );
};

export default UploadForm;