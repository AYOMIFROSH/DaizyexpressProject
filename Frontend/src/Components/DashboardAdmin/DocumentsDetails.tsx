import React, { useState } from "react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  title: string;
  user: string;
  Date: string;
  status: string;
}

const data: User[] = [
  { id: 1, title: "Legal 1", user: "John Smith", Date: "11-11-2024", status: "processed" },
  { id: 2, title: "Legal 2", user: "Prakash", Date: "20-11-2024", status: "not processed" },
  { id: 3, title: "Legal 3", user: "Faruq", Date: "1-12-2024", status: "processed" },
  { id: 4, title: "Legal 4", user: "Faruq", Date: "2-12-2024", status: "not processed" },
  { id: 5, title: "Legal 5", user: "John Smith", Date: "30-11-2024", status: "processed" },
  { id: 6, title: "Legal 6", user: "Prakash", Date: "02-12-2024", status: "processed" },
];

const App: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const filteredData = data.filter((user) =>
    Object.values(user).join(" ").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen mt-32">
      {/* Header Section */}
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

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg  max-lg:w-[300px] w-full">
        <table className="min-w-[1000px] max-sm:min-w-full table-auto text-left border-collapse max-sm:overflow-scroll">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">#</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">Doc Title</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">Sent By</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">Date</th>
              <th className="px-4 py-2 border border-gray-300 text-sm sm:text-base">Status</th>
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
                    {user.title}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                    <Link to={`/userdetails/${user.id}`} className="text-blue-500 hover:underline">
                      {user.user}
                    </Link>
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-sm sm:text-base">
                    {user.Date}
                  </td>
                  <td
                    className={`px-4 py-2 border border-gray-300 text-sm sm:text-base ${
                      user.status === "processed"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
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

export default App;
