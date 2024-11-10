import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/Back.png";
import { useState } from "react";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";

export const MenuLink = [
  {
    paths: "/",
    link: "Home",
  },
  {
    paths: "/",
    link: "Settings",
  },
  {
    paths: "/",
    link: "Exchange",
  },
  {
    paths: "/",
    link: "One legal",
  },
  {
    paths: "/",
    link: "Wallet",
  },
];

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div className="bg-gradient-to-r from-yellow-300 to-yellow-700 shadow-md">
      <div className="container  ">
        <div className=" flex  items-center justify-between gap-16">
          <a
            href="#"
            className="font-bold flex text-2xl  md:text-3xl lg:text-4xl gap-1 py-3  "
          >
            <img src={Logo} alt="" className="w-20 rounded-full " />
            Server Manager
          </a>
          <div className="lg:flex hidden">
            <ul className="flex items-center gap-8">
              {MenuLink.map(({ paths, link }) => {
                return (
                  <li key={paths} className="cursor-pointer  py-4">
                    <NavLink
                      to={paths}
                      className="text-lg font-medium hover:text-blue-500 py-2  hover:border-b-2 hover:border-blue-500 transition-all duration-500"
                    >
                      {link}
                    </NavLink>
                  </li>
                );
              })}
              <Link
                to={"/register"}
                className="bg-primary text-white hover:bg-blue-500 duration-300 rounded-lg px-4 py-2"
              >
                Register
              </Link>
            </ul>
          </div>
          {/* mobile view */}
          <div className="md:hidden flex items-center gap-4">
            {showMenu ? (
              <HiMenuAlt1
                onClick={toggleMenu}
                className="text-2xl cursor-pointer"
              />
            ) : (
              <HiMenuAlt3
                onClick={toggleMenu}
                className="text-2xl cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
      <ResponsiveMenu showMenu={showMenu} />
    </div>
  );
};

export default Navbar;
