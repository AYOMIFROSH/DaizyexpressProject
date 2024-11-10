import { MenuLink } from "./Navbar";
import { Link, NavLink } from "react-router-dom";

const ResponsiveMenu = ({ showMenu }) => {
  return (
    <div
      className={`${showMenu ? "left-0" : "left-[-100%]"}
    fixed bottom-0 top-0 w-[75%] transition-all duration-200 pt-16  px-8 bg-gray-500  z-50 md:hidden shadow-md flex flex-col justify-between pb-5`}
    >
      <div className="">
        <ul className="inline-block  ">
          {MenuLink.map(({ paths, link }) => {
            return (
              <li key={paths} className="cursor-pointer py-6">
                <NavLink
                  to={paths}
                  className="text-lg font-medium hover:text-blue-500 py-2 hover:border-b-2 hover:border-blue-500 transition-all duration-500 "
                >
                  {link}
                </NavLink>
              </li>
            );
          })}
          <Link
            to={"/register"}
            className="bg-primary text-white hover:bg-blue-500 duration-300 rounded-lg px-4 py-2 "
          >
            Register
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
