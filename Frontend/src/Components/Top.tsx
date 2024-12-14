// import { FaRegUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png"
import { Image, Typography } from "antd";

import { useAuth } from "../Context/useContext";
import { FaBars } from "react-icons/fa6";


 const Top = ({isAdmin} : {isAdmin: boolean}) => {
  const {  userData } = useAuth();

  
   return (
    <header className="h-[100px] flex items-center justify-between fixed top-0 z-40 w-full bg-white px-6 py-4 nav">
        <Image src={logo} alt="logo" width={200} preview={false} style={{cursor: "pointer"}}></Image>
          <div className="flex gap-3 ">
            {/* <FaRegUserCircle className="text-4xl" /> */}
              <Typography.Paragraph className=" text-[10px]">{isAdmin ? `Welcome! ${userData.userName}` : `welcome! ${userData.userName}`}</Typography.Paragraph>
            </div>
            <FaBars/>
    </header>
   )
 }
 
 export default Top