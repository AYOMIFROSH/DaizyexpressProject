import Img from "../../assets/group1.avif";
import Img1 from "../../assets/group2.avif";
import Img2 from "../../assets/group3.avif";
import Img3 from "../../assets/group4.avif";
import Img4 from "../../assets/group5.avif";

const Hero = () => {
	return (
		<div className="bg-[#f6f3f0] px-5 mt-[50px] lg:mt-[103px]">
			<div className="max-w-[1240px] space-y-16 py-20 mx-auto">
				<div className="grid lg:grid-cols-2">
					<div className="space-y-16">
						<h2 className="lg:text-[45px] leading-[35px] text-[30px] font-semibold lg:leading-[50px]">
							Serve documents nationwide in 24h with{" "}
							<span className="text-green-500">open communication</span>
						</h2>
						<div className="space-y-4">
							<p className="text-[18px]">
								Top law firms use Proof to digitalize, automate, and scale
								service of process nationwide — now you can too!
							</p>
							<div className="flex lg:flex-row flex-col items-center gap-y-4 gap-x-4">
								<button className="bg-[#001829] hover:bg-green-500 duration-500 py-3 px-6 hover:text-black rounded-[5px] w-full lg:w-fit text-white font-medium">
									Create your free account
								</button>
								<button className="border-green-500 w-full border-2 hover:bg-green-500 lg:w-fit duration-500 py-3 px-6 rounded-[5px] font-medium">
									Get a demo
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="space-y-4">
					<h2 className="font-medium text-[20px]">
						Trusted by the best in the business
					</h2>
					<div className="flex items-center gap-x-2 lg:gap-x-8 justify-between">
						<img
							className="lg:h-[75px] w-[15%] lg:w-fit object-cover"
							src={Img}
							alt=""
						/>
						<img
							className="lg:h-[75px] w-[15%] lg:w-fit object-cover"
							src={Img1}
							alt=""
						/>
						<img
							className="lg:h-[75px] w-[15%] lg:w-fit object-cover"
							src={Img2}
							alt=""
						/>
						<img
							className="lg:h-[75px] w-[15%] lg:w-fit object-cover"
							src={Img3}
							alt=""
						/>
						<img
							className="lg:h-[75px] w-[15%] lg:w-fit object-cover"
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
