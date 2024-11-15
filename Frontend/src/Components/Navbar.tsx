import React from "react";
import Logo from "../assets/logo.png";

const Navbar = () => {
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

	return (
		<div className=" flex items-center justify-between">
			<img className="w-[180px]" src={Logo} alt="" />
			<div className="pr-5 flex items-center gap-x-10">
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
