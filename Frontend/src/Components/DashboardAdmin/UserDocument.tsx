import React, { useState, useRef } from "react";

interface User {
  id: number;
  title: string;
  documentBlob: Blob;
  Date: string;
  status: string;
}

const initialData: User[] = [];

const UserDocuments: React.FC = () => {
  const [data, setData] = useState<User[]>(initialData); 
  const [searchText, setSearchText] = useState(""); 
  const [documentTitle, setDocumentTitle] = useState(""); 
  const [file, setFile] = useState<File | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        alert("Please upload a valid PDF file!");
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        setFile(null);
      }
    }
  };

  const handleFileUpload = () => {
    if (file && documentTitle) {
      const newDocument: User = {
        id: data.length + 1, 
        title: documentTitle, 
        documentBlob: new Blob([file], { type: file.type }), 
        Date: new Date().toLocaleDateString(), 
        status: "processed", 
      };

      setData([...data, newDocument]); 
      setFile(null); 
      setDocumentTitle(""); 
      if (fileInputRef.current) fileInputRef.current.value = ""; 
    } else {
      alert("Please provide a document title and select a PDF file to upload!");
    }
  };

  const handleDownload = (documentBlob: Blob, title: string) => {
    const url = window.URL.createObjectURL(documentBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.pdf`; 
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredData = data.filter((user) =>
    Object.values(user).join(" ").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen mt-32 mx-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Documents</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-[800px] table-auto text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300">#</th>
              <th className="px-4 py-2 border border-gray-300">Doc Title</th>
              <th className="px-4 py-2 border border-gray-300">Date</th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((user, index) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 border border-gray-300">{user.id}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.title}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.Date}</td>
                  <td
                    className={`px-4 py-2 border border-gray-300 ${
                      user.status === "processed"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => handleDownload(user.documentBlob, user.title)}
                      className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                      Download
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

      <div className="my-6">
        <label htmlFor="documentTitle" className="block text-sm font-medium text-gray-700">
          Document Title
        </label>
        <input
          type="text"
          id="documentTitle"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter document title"
        />
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mt-4">
          Upload PDF File
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
          accept="application/pdf" 
        />
        <button
          onClick={handleFileUpload}
          className="w-full bg-yellow-400 text-white py-2 px-4 rounded-md mt-4 hover:bg-yellow-500 focus:outline-none focus:ring-offset-2"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UserDocuments;
