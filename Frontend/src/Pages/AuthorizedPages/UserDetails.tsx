import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import Sidebar from "../../Components/Sidebar";
import Top from "../../Components/Top";
import UserDocuments from "../../Components/DashboardAdmin/UserDocument";
import { useAuth } from "../../Context/useContext";

const UserDetails: React.FC = () => {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>(); 
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://daizyexserver.vercel.app/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        const result = await response.json();
        if (result.status === 'success') {
          setUser({
            name: result.data.userName,
            email: result.data.email,
          });
        } else {
          console.error('Error fetching user details:', result.message);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, [id, token]);
  

  return (
    <div className="bg-[#FAFDFB]">
      <Top isAdmin={true} />
      <div className="flex">
        <Sidebar isAdmin={true} />
        <div className="flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-start mt-32 px-12">
            <h2 className="mb-10 text-[#5A5C69] font-bold text-[20px]">Profile</h2>
            <div className="flex items-center justify-between gap-52 w-full max-sm:flex-col max-sm:gap-5 max-sm:items-center">
              <Avatar size={100} icon={<UserOutlined />} />
              <div className="flex flex-col items-center">
                <p className="font-bold text-[18px]">Name</p>
                <span className="text-[#5A5C69] text-[16px]">
                  {user ? user.name : "Loading..."}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-bold text-[18px]">Email ID</p>
                <span className="text-[#5A5C69] text-[16px]">
                  {user ? user.email : "Loading..."}
                </span>
              </div>
            </div>
          </div>
          <UserDocuments />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
