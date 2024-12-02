import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png"
import { Image, Typography } from "antd";


 const Top = ({isAdmin} : {isAdmin: boolean}) => {
   return (
    <header className="h-[100px] flex items-center justify-between fixed top-0 z-40 w-full bg-white px-6 py-4 nav">
        <Image src={logo} alt="logo" width={200}></Image>
          <div className="flex gap-3 ">
            <FaRegUserCircle className="text-4xl" />
              <Typography.Paragraph className=" text-[20px]">{isAdmin ? "Welcome Admin" : "Welcome Faruq Oloyede"}</Typography.Paragraph>
            <Link to='/login' className="text-[20px]">Logout</Link>
            </div>
    </header>
   )
 }
 
 export default Top