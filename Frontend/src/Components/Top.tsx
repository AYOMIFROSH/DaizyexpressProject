import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png"
import { Image, Typography } from "antd";

import { useAuth } from "../Context/useContext";


 const Top = ({isAdmin} : {isAdmin: boolean}) => {
  const { logout, userData } = useAuth();

  const handleLogout = async () => {
    await logout();
};
   return (
    <header className="h-[100px] flex items-center justify-between fixed top-0 z-40 w-full bg-white px-6 py-4 nav">
        <Image src={logo} alt="logo" width={200} preview={false} style={{cursor: "pointer"}}></Image>
          <div className="flex gap-3 ">
            {/* <FaRegUserCircle className="text-4xl" /> */}
              <Typography.Paragraph className=" text-[20px]">{isAdmin ? `Welcome! ${userData.userName}` : `welcome! ${userData.userName}`}</Typography.Paragraph>
            <Link to='/login' onClick={handleLogout} className="text-[20px] logout">Logout</Link>
            </div>
    </header>
   )
 }
 
 export default Top