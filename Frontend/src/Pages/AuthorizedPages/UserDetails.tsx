import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import Sidebar from "../../Components/Sidebar";
import Top from "../../Components/Top";
import UserDocuments from "../../Components/DashboardAdmin/UserDocument";


const UserDetails = () => {
    return (
      <div className="bg-[#FAFDFB]">
        <Top isAdmin={true} />
        <div className="flex ">
          <Sidebar isAdmin ={true} />
            <div className="flex flex-col items-start mt-32 px-12">
                <h2 className="mb-10 text-[#5A5C69] font-bold text-[20px]">profile</h2>
                <div className="flex items-center justify-between  gap-52 w-full max-sm:flex-col max-sm:gap-5 max-sm:items-center">
                    <Avatar size={100} icon={<UserOutlined />}></Avatar>
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-[18px]">Name</p>
                        <span className="text-[#5A5C69] text-[16px]">Faruq</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-[18px]">Email ID</p>
                        <span className="text-[#5A5C69] text-[16px]">faruq@gmail.com</span>
                    </div>
                </div>
                {/*  */}
                <UserDocuments />
            </div>
        </div>
        
      </div>
    )
  }
  
  export default UserDetails