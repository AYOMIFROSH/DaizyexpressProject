import { useState } from "react";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { LiaTimesSolid } from "react-icons/lia";

export const MenuLink = [
  {
    paths: "/",
    link: "For Process Servers",
  },
  {
    paths: "/",
    link: "Pricing",
  },
  {
    paths: "/",
    link: "Products",
  },
  {
    paths: "/",
    link: "Problems We Solve",
  },
  {
    paths: "/",
    link: "Resources",
  },
];

const Navbar = () => {
  const [color, setColor] = useState("bg-[#f6f3f0]");
  const [nav, setNav] = useState(false);

  const navigate = useNavigate();

  window.addEventListener("scroll", () => {
    if (scrollY > 10) {
      setColor("bg-[#fff]");
    } else {
      setColor("bg-[#f6f3f0]");
    }
  });

  return (
    <div
      className={`lg:px-10 fixed pr-5 top-0 duration-500 z-[9999] ${color} left-0 w-full flex items-center justify-between`}
    >
      <img className="lg:w-[180px] h-[60px] lg:h-full" src={Logo} alt="" />
      <HiOutlineMenuAlt4
        onClick={() => setNav(true)}
        className="size-8 lg:hidden"
      />
      <div className="pr-5 lg:flex hidden items-center gap-x-10">
        <div className="flex items-center gap-x-8">
          {MenuLink.map((item, index) => {
            return (
              <p
                key={index}
                className="font-medium hover:text-yellow-300 duration-500 cursor-pointer"
              >
                {item.link}
              </p>
            );
          })}
        </div>
        <div className="flex items-center gap-x-5">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-[5px] border-2 font-semibold"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2.5 rounded-[5px] bg-yellow-300 font-semibold"
          >
            Get started
          </button>
        </div>
      </div>


      {/* mobile view */}
      <div
        className={`fixed top-0 ${
          nav ? "translate-x-0" : "translate-x-[120vw]"
        } duration-500 left-0 px-10 w-full h-screen lg:hidden bg-white`}
      >
        <LiaTimesSolid
          onClick={() => setNav(false)}
          className="absolute top-8 right-8 size-7"
        />
        <div className="flex flex-col pt-20 items-center gap-y-5">
          {MenuLink.map((item, index) => {
            return (
              <p
                key={index}
                className="font-medium hover:text-yellow-300 duration-500 cursor-pointer"
              >
                {item.link}
              </p>
            );
          })}
        </div>
        <div className="flex flex-col pt-8 items-center gap-y-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 w-full rounded-[5px] border-2 font-semibold"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2.5 w-full rounded-[5px] bg-yellow-300 font-semibold"
          >
            Get started
          </button>
		  <p> © Copyright 2024 Daizy Express  Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
