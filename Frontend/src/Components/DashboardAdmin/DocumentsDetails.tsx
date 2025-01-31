import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "antd";
import { useAuth } from "../../Context/useContext";

interface FileDetails {
  _id: string;
  fileName: string;
  uploadedAt: string;
  status: string;
}

interface User {
  _id: string;
  userName: string;
  files: FileDetails[];
}

const DocumentDetails: React.FC = () => {
  const { token } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [usersWithFiles, setUsersWithFiles] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const Base_Url =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://daizyexserver.vercel.app";

  useEffect(() => {
    const fetchUsersWithFiles = async () => {
      try {
        const response = await axios.get(`${Base_Url}/api/admin/users-with-documents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const usersData = response.data?.data || [];
        setUsersWithFiles(usersData);
      } catch (error) {
        console.error("Error fetching users with documents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchUsersWithFiles();
    }
  }, [token]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchText(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  const filteredData = usersWithFiles
    .map((user) => ({
      ...user,
      files: user.files.filter((file) =>
        file.fileName.toLowerCase().includes(debouncedSearchText.toLowerCase())
      ),
    }))
    .filter((user) => user.files.length > 0);

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen mt-32">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Documents</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg w-full">
        <table className="min-w-[930px] table-auto text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300">#</th>
              <th className="px-4 py-2 border border-gray-300">File Name</th>
              <th className="px-4 py-2 border border-gray-300">Sent By</th>
              <th className="px-4 py-2 border border-gray-300">Date</th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: Math.max(1, length) }).map((_, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Input active size="small" />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Input active size="small" />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Input active size="small" />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Input active size="small" />
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    <Skeleton.Input active size="small" />
                  </td>
                </tr>
              ))
              : filteredData.length > 0
                ? (() => {
                  let rowIndex = 0;
                  return filteredData.flatMap((user) =>
                    user.files.map((file) => {
                      rowIndex += 1;
                      return (
                        <tr
                          key={`${user._id}-${file.fileName}-${file.uploadedAt}`}
                          className={`hover:bg-gray-100 ${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                        >
                          <td className="px-4 py-2 border border-gray-300">{rowIndex}</td>
                          <td className="px-4 py-2 border border-gray-300">{file.fileName}</td>
                          <td className="px-4 py-2 border border-gray-300">
                            <Link to={`/userdetails/${user._id}`} className="text-blue-500 hover:underline">
                              {user.userName}
                            </Link>
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </td>
                          <td
                            className={`px-4 py-2 border border-gray-300 
                              ${file.status === "not processed"
                                ? "bg-red-100 text-red-600"
                                : file.status === "in process"
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-green-100 text-green-600"}`}
                          >
                            {file.status}
                          </td>
                        </tr>
                      );
                    })
                  );
                })()
                : (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center border border-gray-300">
                      No matching files found
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentDetails;
