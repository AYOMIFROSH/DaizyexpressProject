import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
import { useAuth } from "../../Context/useContext";

interface User {
  id: string; // Change to string because _id from the API is a string
  name: string;
  email: string;
  document: number;
  role: string;
}

const Users: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<User[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://daizyexserver.vercel.app/api/admin/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        // console.log("API Response:", result);

        const users = result.data.map((user: any) => ({
          id: user._id,  
          name: user.userName,
          email: user.email,
          role: user.role,
          document: user.fileUploadCount,
        }));
        // console.log("Processed Users:", users);

        // Reset the data without appending
        setData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const filteredData = searchText
    ? data.filter((user) =>
        Object.values(user).join(" ").toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen mt-32 w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Users</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value); 
          }}
          className="w-full sm:max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg mt-10 max-sm:max-w-[300px] max-w-full">
        <table className="min-w-full table-auto text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">#</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">Name</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">Email</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">Role</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base text-center">
                NO. of Doc Uploaded
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr
                    key={`loading-${index}`}
                    className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                      <Skeleton.Input active size="small" />
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                      <Skeleton.Input active size="small" />
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                      <Skeleton.Input active size="small" />
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                      <Skeleton.Input active size="small" />
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                      <Skeleton.Input active size="small" />
                    </td>
                  </tr>
                ))
              : filteredData.length > 0
              ? filteredData.map((user, index) => (
                  <tr
                    key={user.id} 
                    className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                      <Link to={`/userdetails/${user.id}`} className="text-blue-500 hover:underline">
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                      {user.role}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base text-center">
                      {user.document}
                    </td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center border border-gray-300 text-sm sm:text-base">
                    No users found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
