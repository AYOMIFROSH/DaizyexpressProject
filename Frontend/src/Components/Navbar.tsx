import { useState } from "react";
import Logo from "../assets/logo.png";

const Navbar = () => {
	const [color, setColor] = useState("bg-[#f6f3f0]");

	const MenuLink = [
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

	window.addEventListener("scroll", () => {
		if (scrollY > 10) {
			setColor("bg-[#fff]");
		} else {
			setColor("bg-[#f6f3f0]");
		}
	});

	return (
		<div
			className={`lg:px-10 fixed top-0 duration-500 z-[9999] ${color} left-0 w-full flex items-center justify-between`}
		>
			<img className="lg:w-[180px] h-[60px] lg:h-full" src={Logo} alt="" />
			<div className="pr-5 lg:flex hidden items-center gap-x-10">
				<div className="flex items-center gap-x-8">
					{MenuLink.map((item, index) => {
						return (
							<p
								key={index}
								className="font-medium hover:text-yellow-400 duration-500 cursor-pointer"
							>
								{item.link}
							</p>
						);
					})}
				</div>
				<div className="flex items-center gap-x-5">
					<button className="px-5 py-2 rounded-[5px] border-2 font-semibold">
						Log in
					</button>
					<button className="px-5 py-2.5 rounded-[5px] bg-yellow-400 font-semibold">
						Get started
					</button>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
