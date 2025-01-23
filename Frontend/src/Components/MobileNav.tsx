import { NavLink } from "react-router-dom";
import { FaArrowLeft, FaUsers } from "react-icons/fa6";
import { AiFillDashboard } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaFileUpload, FaStar } from "react-icons/fa";
import { useAuth } from "../Context/useContext";

type SideLink = {
  id: number;
  name: any;
  path: any;
  icon: React.ReactNode; // Type for JSX elements
};

const MobileNav = ({ isAdmin }: { isAdmin: boolean }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const SideLink: SideLink[] = [
    {
      id: 1,
      name: "Dashboard",
      path: isAdmin ? "/admin" : "/user",
      icon: <AiFillDashboard />,
    },
    {
      id: 2,
      name: "Documents",
      path: isAdmin ? "/totaldocuments" : "/document",
      icon: <IoDocumentTextOutline />,
    },
    {
      id: 3,
      name: isAdmin ? "Users" : "Create",
      path: isAdmin ? "/manageusers" : "/upload",
      icon: isAdmin ? <FaUsers /> : <FaFileUpload />,
    },
  ];

  // const handleLinkClick = (path: string) => {
  //   localStorage.setItem("lastRoute", path);
  // };

  const linkclass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "flex items-center px-6 max-md:px-3 max-md:py-2 ml-5 max-md:ml-1 font-bold text-[#407BBB]"
      : "flex items-center px-6 max-md:px-3 max-md:py-2 ml-5 max-md:ml-1 text-[#5A5C69]";


  return (
    <div className="">
      <aside className="relative top-0 left-0 z-0 w-[50%] h-screen bg-white border-r border-gray-200   block md:hidden">
        <FaStar className='text-right h-10 w-6'/>
        <div className="h-full pb-4 overflow-y-auto">
          <div className="bg-[#407BBB] h-[1px] w-full mb-10" />
          <ul className="list-none flex flex-col gap-10 mt-36">
            {SideLink.map(({ name, id, path, icon }) => (
              <NavLink 
                to={path} 
                key={id} 
                className={linkclass}
                >
                <span className="text-2xl mr-4 text-[#5A5C69] font-bold ">
                  {icon}
                </span>
                <span className="flex-1 me-3 text-[18px] text-[#5A5C69] max-md:hidden">
                  {name}
                </span>
              </NavLink>
            ))}
            <div onClick={handleLogout} className="flex items-center px-6 max-md:px-3 max-md:py-2 ml-5 max-md:ml-1 ">
              <span className="text-2xl mr-4 text-[#5A5C69] font-bold ">
                <FaArrowLeft />
              </span>
              <span className="flex-1 me-3 text-[18px] text-[#5A5C69] max-md:hidden">
                Logout
              </span>
            </div>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default MobileNav;
