import React, { useState } from "react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  title: string;
  user: string;
  Date: string;
  status: string
}

const data: User[] = [
  { id: 1, title: "Legal 1", user: "John smith", Date: "11-11-2024", status: "processed"  },
  { id: 2, title: "Legal 2", user: "prakash", Date: "20-11-2024", status: "not processed" },
  { id: 3, title: "Legal 3", user: "faruq", Date: "1-12-2024", status: "processed" },
  { id: 4, title: "Legal 4", user: "faruq", Date: "2-12-2024", status: "not processed" },
  { id: 5, title: "Legal 5", user: "jogn smith", Date: "30-11-2024", status: "processed" },
  { id: 6, title: "Legal 6", user: "prakash", Date: "02-12-2024", status: "processed" },
  
];

const App: React.FC = () => {
  const [searchText, setSearchText] = useState("");


  const filteredData = data.filter((user) =>
    Object.values(user).join(" ").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen mt-32 mx-32">
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
        <table className="w-[800px] table-auto text-left border-collapse ">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300">#</th>
              <th className="px-4 py-2 border border-gray-300">Doc Title</th>
              <th className="px-4 py-2 border border-gray-300">Sent By</th>
              <th className="px-4 py-2 border border-gray-300">Date</th>
              <th className="px-4 py-2 border border-gray-300">status</th>
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
                  <td className="px-4 py-2 border border-gray-300"><Link to={`/userdetails/${user.id}`}>{user.user}</Link></td>
                  <td className="px-4 py-2 border border-gray-300">{user.Date}</td>
                  <td className={`px-4 py-2 border border-gray-300 ${user.status === "processed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{user.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center border border-gray-300">
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
