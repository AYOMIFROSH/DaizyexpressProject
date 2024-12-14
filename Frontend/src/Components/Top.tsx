import { useState } from "react";
import logo from "../assets/logo.png"
import { Image, Typography } from "antd";

import { useAuth } from "../Context/useContext";
import { FaBars } from "react-icons/fa6";
import MobileNav from "./MobileNav";


 const Top = ({isAdmin} : {isAdmin: boolean}) => {
  const {  userData } = useAuth();
  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false);

  const toggleNavbar = (prev:boolean)=> setIsNavbarOpen(!prev);

  
   return (
    <header className="h-[100px] flex items-center justify-between fixed top-0 z-40 w-full bg-white px-6 py-4 nav">
        <Image src={logo} alt="logo" width={200} preview={false} style={{cursor: "pointer"}}></Image>
          <div className="flex gap-3 ">
            {/* <FaRegUserCircle className="text-4xl" /> */}
              <Typography.Paragraph className=" text-[16px] hidden sm:block">{isAdmin ? `Welcome! ${userData.userName}` : `welcome! ${userData.userName}`}</Typography.Paragraph>
            </div>
            <FaBars className="w-10 h-10 block md:hidden cursor-pointer" onClick={()=> toggleNavbar}/>
              {isNavbarOpen ? <MobileNav isAdmin={false} />  : null}
    </header>
   )
 }
 
 export default Top