import Img from "../../assets/1.svg";
import Img1 from "../../assets/2.svg";
import Img2 from "../../assets/3.svg";
import Img3 from "../../assets/4.svg";
import Img4 from "../../assets/5.svg";


const Hero = () => {
	return (
		<div className="bg-[#f6f3f0] px-5 mt-[50px] lg:mt-[103px]">
			<div className="max-w-[1240px] space-y-16 py-20 mx-auto">
				<div className="grid lg:grid-cols-2">
					<div className="space-y-16">
						<h2 className="lg:text-[45px] leading-[35px] text-[30px] font-semibold lg:leading-[50px]">
							Streamline Your Legal Document  <span className="text-yellow-300 ">Processing</span>
						
						</h2>
						<div className="space-y-4">
							<p className="text-[18px]">
								Fast, reliable and secure document management solutions for law firms, corporations and individuals.
							</p>
							<div className="flex lg:flex-row flex-col items-center gap-y-4 gap-x-4">
								{/* <button className="bg-[#001829] hover:bg-green-500 duration-500 py-3 px-6 hover:text-black rounded-[5px] w-full lg:w-fit text-white font-medium">
									Create your free account
								</button> */}
								<button className="border-yellow-300 w-full border-2 mt-10 hover:bg-yellow-500 lg:w-fit duration-500 py-3 px-6 rounded-[5px] font-medium">
									Get Started Today
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="space-y-4">
					<h2 className="font-medium text-[20px] text-center">
						Trusted by the best in the business
					</h2>
					<div className="flex items-center gap-x-2 lg:gap-x-5 px-4 w-full justify-center ">
						<img
							className="lg:h-[60px] w-[20%] lg:w-fit"
							src={Img}
							alt=""
						/>
						<img
							className="lg:h-[60px] w-[20%] lg:w-fit "
							src={Img1}
							alt=""
						/>
						<img
							className="lg:h-[60px] w-[20%] lg:w-fit "
							src={Img2}
							alt=""
						/>
						<img
							className="lg:h-[60px] w-[20%] lg:w-fit "
							src={Img3}
							alt=""
						/>
						<img
							className="lg:h-[60px] w-[20%] lg:w-fit "
							src={Img4}
							alt=""
						/>
					</div>
				</div>
				
			</div>
		</div>
	);
};

export default Hero;
