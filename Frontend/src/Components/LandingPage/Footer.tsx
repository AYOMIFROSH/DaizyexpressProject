import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";


const Footer = () => {
	return (
		<div className="lg:pt-10 px-5 pb-16 bg-white text-gray-800 hover:text-gray-600">
			<div className="max-w-[1240px] gap-y-10 grid lg:grid-cols-2 mx-auto">
				<div className="">
					<img className="w-[180px]" src={Logo} alt="Appmosphere Logo" />
					<p className="lg:text-[30px] text-[20px] mb-8 lg:w-[400px] lg:leading-[35px] leading-[25px] font-semibold">
						Connecting the world through innovative solutions
					</p>
					<button className="px-5 py-2.5 rounded-[5px] bg-yellow-500 text-white font-semibold">
						<Link to='/register'>Learn more</Link>
					</button>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-3 text-wrap lg:gap-x-3 gap-y-16">
					<div>
						<h2 className="font-semibold">About Us</h2>
						<div className="text-neutral-400 space-y-3 font-medium pt-3 text-[14px]">
							<p className="cursor-pointer hover:text-gray-600">Our Story</p>
							<p className="cursor-pointer hover:text-gray-600">Team</p>
							<p className="cursor-pointer hover:text-gray-600">Careers</p>
							<Link to="/about-us" className="cursor-pointer hover:text-gray-600">Contact</Link>
						</div>
					</div>
					<div>
						<h2 className="font-semibold">Services</h2>
						<div className="text-neutral-400 space-y-3 font-medium pt-3 text-[14px]">
							<p className="cursor-pointer hover:text-gray-600">Consulting</p>
							<p className="cursor-pointer hover:text-gray-600">Development</p>
							<p className="cursor-pointer hover:text-gray-600">Design</p>
							<p className="cursor-pointer hover:text-gray-600">Marketing</p>
						</div>
					</div>
					<div>
						<h2 className="font-semibold">Resources</h2>
						<div className="text-neutral-400 space-y-3 font-medium pt-3 text-[14px]">
							<p className="cursor-pointer hover:text-gray-600">Blog</p>
							<p className="cursor-pointer hover:text-gray-600">Case Studies</p>
							<p className="cursor-pointer hover:text-gray-600">Guides</p>
							<p className="cursor-pointer hover:text-gray-600">Help Center</p>
						</div>
					</div>
					<div>
						<h2 className="font-semibold">Legal</h2>
						<div className="text-neutral-400 space-y-3 font-medium pt-3 text-[14px]">
							<p className="cursor-pointer hover:text-gray-600">Privacy Policy</p>
							<p className="cursor-pointer hover:text-gray-600">Terms of Service</p>
							<p className="cursor-pointer hover:text-gray-600">Cookie Policy</p>
						</div>
					</div>
					<div>
						<h2 className="font-semibold">Follow Us</h2>
						<div className="text-neutral-400 font-medium pt-3 text-2xl gap-5 mb-10 flex items-center">
							<p className="cursor-pointer hover:text-gray-600"><a href="https://facebook.com"><FaFacebook /></a></p>
							<p className="cursor-pointer hover:text-gray-600"><a href="https://twitter.com"><FaTwitter /></a></p>
							<p className="cursor-pointer hover:text-gray-600"><a href="https://linkedin.com"><FaLinkedin /></a></p>
						</div>
					</div>
				</div>
			</div>
			<p className="text-center mt-10">© {new Date().getFullYear()} Deizy Express LLC. All rights reserved.</p>
		</div>
	);
};

export default Footer;
