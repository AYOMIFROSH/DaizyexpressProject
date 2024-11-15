import Logo from "../../assets/logo.png";

const Footer = () => {
	return (
		<div className="lg:pt-10 px-5 pb-16">
			<div className="max-w-[1240px] gap-y-10 grid lg:grid-cols-2 mx-auto">
				<div className="">
					<img className="w-[180px]" src={Logo} alt="" />
					<p className="lg:text-[30px] text-[20px] mb-8 w-[400px] lg:leading-[35px] leading-[25px] font-semibold">
						The smarter way to serve legal documents
					</p>
					<button className="px-5 py-2.5 rounded-[5px] bg-yellow-400 font-semibold">
						How it works
					</button>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-3 text-wrap lg:gap-x-3 gap-y-16">
					<div>
						<h2 className="font-semibold">How it works</h2>
						<div className="text-neutral-500 space-y-3 font-medium pt-3 text-[14px]">
							<p className="cursor-pointer hover:text-black">Overview</p>
							<p className="cursor-pointer hover:text-black">Pricing</p>
							<p className="cursor-pointer hover:text-black">Service Areas</p>
							<p className="cursor-pointer hover:text-black">Become a Server</p>
						</div>
					</div>
					<div>
						<h2 className="font-semibold">Why Proof</h2>
						<div className="text-neutral-500 space-y-3 font-medium pt-3 text-[14px]">
							<p className="cursor-pointer hover:text-black">For Law Firms</p>
							<p className="cursor-pointer text-wrap hover:text-black">
								For Collections Agencies
							</p>
							<p className="cursor-pointer hover:text-black">For Individuals</p>
							<p className="cursor-pointer hover:text-black">For Government</p>
							<p className="cursor-pointer hover:text-black">
								For Process Serving Companies
							</p>
							<p className="cursor-pointer hover:text-black">For Servers</p>
							<p className="cursor-pointer hover:text-black">For Partners</p>
						</div>
					</div>
					<div>
						<h2 className="font-semibold">Resources</h2>
						<div className="text-neutral-500 space-y-3 font-medium pt-3 text-[14px]">
							<p className="cursor-pointer hover:text-black">Blog</p>
							<p className="cursor-pointer hover:text-black">Press</p>
							<p className="cursor-pointer hover:text-black">Events</p>
							<p className="cursor-pointer hover:text-black">Status</p>
							<p className="cursor-pointer hover:text-black">API Docs</p>
						</div>
					</div>
					<div>
						<h2 className="font-semibold">Company</h2>
						<div className="text-neutral-500 space-y-3 font-medium pt-3 text-[14px]">
							<p className="cursor-pointer hover:text-black">About</p>
							<p className="cursor-pointer hover:text-black">Careers</p>
							<p className="cursor-pointer hover:text-black">Contact</p>
						</div>
					</div>
					<div>
						<h2 className="font-semibold">Socials</h2>
						<div className="text-neutral-500 space-y-3 font-medium pt-3 text-[14px]">
							<p className="cursor-pointer hover:text-black">Facebook</p>
							<p className="cursor-pointer hover:text-black">Twitter</p>
							<p className="cursor-pointer hover:text-black">LinkedIn</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
