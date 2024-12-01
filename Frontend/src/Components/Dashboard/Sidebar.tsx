
import { NavLink } from "react-router-dom"

import { AiFillDashboard } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaFileUpload } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";

type SideLink = {
  id: number;
  name: string;
  path: string;
  icon: React.ReactNode; // Type for JSX elements
};

const Sidebar = () => {

  const SideLink: SideLink[]  = [
    {
      id: 1,
      name: "Dashboard",
      path: "/user",
      icon: <AiFillDashboard />
    },
    {
      id: 2,
      name: "Documents",
      path: "/document",
      icon: <IoDocumentTextOutline />
    },
    {
      id: 3,
      name: "Upload",
      path: "/upload",
      icon: <FaFileUpload />
    },
    {
      id: 4,
      name: "My Account",
      path: "/account",
      icon: <FaCircleUser />
    },
  ]
  const linkclass = ({ isActive }: {isActive: boolean}) =>
    isActive ? "flex items-center px-6 max-sm:px-3 max-sm:py-2 py-4 ml-5 max-sm:ml-1 sidebar" : "flex items-center px-6 max-sm:px-3 max-sm:py-2 ml-5 max-sm:ml-1 rounded-lg";

  return (
    <div className=''>
      <aside className='sticky top-0 left-0 z-0 w-64 h-screen bg-yellow-400 border-r border-gray-200 max-md:w-60 max-sm:w-[60px]'>
        <div className='h-full pb-4 overflow-y-auto'>
         
          <div className='bg-[#407BBB] h-[1px] w-full mb-10'/>
          <ul className="list-none flex flex-col gap-10 mt-28">
            {SideLink.map(({name, id, path, icon})=>(
              <NavLink to={path} key={id} className={linkclass}>
                <span className='text-2xl mr-4 text-white font-bold '>{icon}</span>
                <span className='flex-1 me-3 text-[18px] text-white max-sm:hidden'>{name}</span>
              </NavLink>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar