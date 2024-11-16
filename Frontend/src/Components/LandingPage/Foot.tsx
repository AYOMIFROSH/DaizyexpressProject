import Img from "../../assets/footer.avif";

const Foot = () => {
	return (
		<div className="bg-[#001829] px-5 mb-10 py-16">
			<div className="max-w-[1240px] mx-auto grid lg:gap-x-10 lg:grid-cols-2">
				<div className="space-y-5 ">
					<h2 className="text-white text-[32px] leading-[35px] lg:text-[45px] lg:leading-[45px] font-semibold lg:w-[400px]">
						Serve smarter with Proof
					</h2>
					<div className="flex lg:flex-row flex-col gap-y-5 lg:gap-x-5">
						<input
							className="lg:flex-1 py-4 px-5  bg-white rounded-[5px] outline-none font-medium"
							placeholder="Enter your email address"
							type="email"
						/>
						<button className="px-5 py-2.5   rounded-[5px] bg-yellow-400 font-semibold">
							Get started
						</button>
					</div>
					<div className="flex flex-col items-start">
						<p className="border-b-4 text-white border-neutral-500 cursor-pointer font-semibold hover:border-white  duration-500">
							See pricing for your state
						</p>
					</div>
				</div>
				<img className="lg:block hidden" src={Img} alt="" />
			</div>
		</div>
	);
};

export default Foot;
