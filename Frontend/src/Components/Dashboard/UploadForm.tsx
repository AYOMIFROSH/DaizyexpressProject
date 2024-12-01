import React, { useState } from "react";
import { toast } from "react-toastify";

const UploadForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Name:", name);
    console.log("File:", file);
    toast.success("your document have been successfully uploaded, you will get notification once it has been processed")
    setName("")
    setFile(null)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] bg-white p-6 rounded-lg shadow-md h-[auto]"
      >
        <h2 className="text-2xl font-bold  text-gray-800 text-center mb-16">Upload A Document</h2>

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
        <button
          type="submit"
          className="w-full bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
