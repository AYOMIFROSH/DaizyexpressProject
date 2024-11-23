
import { NavLink } from "react-router-dom"
import logo from "../../assets/logo.png"
import { AiFillDashboard } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { GiThorHammer } from "react-icons/gi";
import { CgOrganisation } from "react-icons/cg";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
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
      path: "/dashboard",
      icon: <AiFillDashboard />
    },
    {
      id: 2,
      name: "Jobs",
      path: "/jobs",
      icon: <IoIosSend />
    },
    {
      id: 3,
      name: "Court Cases",
      path: "/court",
      icon: <GiThorHammer />
    },
    {
      id: 4,
      name: "Company",
      path: "/company",
      icon: <CgOrganisation />
    },
    {
      id: 5,
      name: "Invoice",
      path: "/invoice",
      icon: <AiFillDollarCircle />
    },
    {
      id: 6,
      name: "Server Pay",
      path: "/server",
      icon: <FaUsers />
    },
    {
      id: 1,
      name: "My Account",
      path: "/account",
      icon: <FaCircleUser />
    },
  ]
  const linkclass = ({ isActive }: {isActive: boolean}) =>
    isActive ? "flex items-center px-6 max-sm:px-3 max-sm:py-2 bg-[#407BBB] py-4 ml-5 max-sm:ml-1 sidebar" : "flex items-center px-6 max-sm:px-3 max-sm:py-2 ml-5 max-sm:ml-1 rounded-lg";

  return (
    <div className='flex-1'>
      <aside className='sticky top-0 left-0 z-40 w-64 h-screen bg-[#1F64AE] border-r border-gray-200 max-md:w-60 max-sm:w-[60px]'>
        <div className='h-full pb-4 overflow-y-auto'>
          <div className="flex items-center justify-between">
            <img src={logo} alt="logo" />
            
          </div>
          <div className='bg-[#407BBB] h-[1px] w-full mb-10'/>
          <ul className="list-none flex flex-col gap-7">
            {SideLink.map(({name, id, path, icon})=>(
              <NavLink to={path} key={id} className={linkclass}>
                <span className='text-2xl mr-4 text-[#619EE0] font-bold '>{icon}</span>
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