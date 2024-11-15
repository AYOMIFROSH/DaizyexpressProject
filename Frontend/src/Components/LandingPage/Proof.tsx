import Img from "../../assets/seen1.avif";
import Img1 from "../../assets/seen2.avif";
import Img2 from "../../assets/seen3.avif";
import Img3 from "../../assets/seen4.avif";
import Art1 from "../../assets/art1.avif";

const Proof = () => {
	return (
		<div className="px-10 pt-20 pb-32">
			<div className="max-w-[1240px] mx-auto">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-[28px]">As seen in</h2>
					<div className="flex items-center gap-x-8 justify-between">
						<img className="h-[75px] object-cover" src={Img} alt="" />
						<img className="h-[75px] object-cover" src={Img1} alt="" />
						<img className="h-[75px] object-cover" src={Img2} alt="" />
						<img className="h-[75px] object-cover" src={Img3} alt="" />
					</div>
				</div>

				<div className="pt-20">
					<h2 className="text-[42px] font-semibold">Hear from Proof</h2>

					<div className="grid grid-cols-2 pt-10">
						<div className="relative  mr-10 ">
							<img
								className="h-[500px] z-[-9] object-cover"
								src={Art1}
								alt=""
							/>
							<div className="absolute top-0 left-0 w-full h-full bg-[#1a2b3a6e]" />

							<div className="absolute flex flex-col items-start justify-end top-0 left-0 w-full h-full p-14">
								<div className="text-white flex flex-col items-start ">
									<p className="text-white text-[18px]">10 min read</p>
									<p className="capitalize text-[32px] font-semibold leading-[40px]">
										What does Daizy Express actually do?
									</p>
									<p className="border-b-4 border-yellow-500 cursor-pointer font-semibold hover:border-black  duration-500">
										Read More
									</p>
								</div>
							</div>
						</div>
						<div className="pl-8 border-dashed flex flex-col justify-center border-l ">
							<div className="flex items-center border-dashed border-b gap-x-6 pb-8">
								<img className="size-[120px] object-cover" src={Art1} alt="" />
								<div>
									<p className="text-[20px] font-semibold">
										Arizona Service of Process Rules - from A to Z
									</p>
									<p>3 min read</p>
								</div>
							</div>
							<div className="flex items-center pt-6 border-dashed border-b gap-x-6 pb-8">
								<img className="size-[120px] object-cover" src={Art1} alt="" />
								<div>
									<p className="text-[20px] font-semibold">
										Arizona Service of Process Rules - from A to Z
									</p>
									<p>3 min read</p>
								</div>
							</div>
							<div className="flex items-center pt-6 gap-x-6">
								<img className="size-[120px] object-cover" src={Art1} alt="" />
								<div>
									<p className="text-[20px] font-semibold">
										Arizona Service of Process Rules - from A to Z
									</p>
									<p>3 min read</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Proof;
