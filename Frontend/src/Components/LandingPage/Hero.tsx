import Img from "../../assets/seen1.avif";
import Img1 from "../../assets/seen2.avif";
import Img2 from "../../assets/seen3.avif";
import Img3 from "../../assets/seen4.avif";

const Hero = () => {
	return (
		<div className="bg-[#f6f3f0] mt-[103px]">
			<div className="max-w-[1240px] space-y-16 py-20 mx-auto">
				<div className="grid grid-cols-2">
					<div className="space-y-16">
						<h2 className="text-[45px] font-semibold leading-[50px]">
							Serve documents nationwide in 24h with{" "}
							<span className="text-yellow-500">open communication</span>
						</h2>
						<div className="space-y-4">
							<p className="text-[18px]">
								Top law firms use Proof to digitalize, automate, and scale
								service of process nationwide — now you can too!
							</p>
							<div className="flex items-center gap-x-4">
								<button className="bg-[#001829] hover:bg-yellow-500 duration-500 py-3 px-6 hover:text-black rounded-[5px] text-white font-medium">
									Create your free account
								</button>
								<button className="border-yellow-500 border-2 hover:bg-yellow-500 duration-500 py-3 px-6 rounded-[5px] font-medium">
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
					<div className="flex items-center gap-x-8 justify-between">
						<img className="h-[75px] object-cover" src={Img} alt="" />
						<img className="h-[75px] object-cover" src={Img1} alt="" />
						<img className="h-[75px] object-cover" src={Img2} alt="" />
						<img className="h-[75px] object-cover" src={Img3} alt="" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
