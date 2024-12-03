import React, { useState } from "react";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  document: number

}

const data: User[] = [
  { id: 1, name: "Gerald Brain",  email: "gerald@gmail.com", document: 9},
  { id: 2, name: "John Smith",  email: "admin@gmail.com", document:8 },
  { id: 3, name: "Faruq Oloyede", email: "faruq@gmail.com", document:4 },
 
];

const Users: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const filteredData = data.filter((user) =>
    Object.values(user).join(" ").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen mt-32 mx-32 w-[1000px]">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>

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

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg ">
        <table className="w-full table-auto text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300">#</th>
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Email</th>
              <th className="px-4 py-2 border border-gray-300">NO. of Doc Uploaded</th>
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
                  <td className="px-4 py-2 border border-gray-300"><Link to={`userdetails${user.id}`}>{user.name}</Link></td>
                  <td className="px-4 py-2 border border-gray-300">{user.email}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center">{user.document}</td>
                  
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

export default Users;
