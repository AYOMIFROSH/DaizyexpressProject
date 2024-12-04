import React, { useState } from "react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  document: number;
}

const data: User[] = [
  { id: 1, name: "Gerald Brain", email: "gerald@gmail.com", document: 9 },
  { id: 2, name: "John Smith", email: "admin@gmail.com", document: 8 },
  { id: 3, name: "Faruq Oloyede", email: "faruq@gmail.com", document: 4 },
];

const Users: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const filteredData = data.filter((user) =>
    Object.values(user).join(" ").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Users</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">#</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">Name</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">Email</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base text-center">
                NO. of Doc Uploaded
              </th>
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
                  <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                    {user.id}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                    <Link
                      to={`/userdetails/${user.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base text-center">
                    {user.document}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-2 text-center border border-gray-300 text-sm sm:text-base"
                >
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
