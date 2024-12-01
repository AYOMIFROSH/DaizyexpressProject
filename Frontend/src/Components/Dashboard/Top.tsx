import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"
import { FaRegUserCircle } from "react-icons/fa";

 const Top = () => {
   return (
    <header className="fixed z-40 top-0 w-full bg-yellow-400 py-4 px-6">
         <div className="flex items-center justify-between">

            <img src={logo} alt="logo" width={144} height={44} />
            <div className="flex items-center gap-3 text-white">
                <FaRegUserCircle className="text-4xl text-white" />
                <p className="text-white">Faruq Oloyede</p>
                <Link to='/login'>Logout</Link>
            </div>
          </div>
    </header>
   )
 }
 
 export default Top