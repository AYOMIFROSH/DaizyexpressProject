import Img1 from "../../assets/step1.avif";
import Img2 from "../../assets/step2.avif";
import Img3 from "../../assets/step3.avif";

const Steps = () => {
	return (
		<div className="bg-[#001829] px-5 py-20">
			<div className="max-w-[1240px] space-y-20 mx-auto">
				<div>
					<h2 className="text-green-500 font-semibold text-[18px]">
						HOW IT WORKS
					</h2>
					<h1 className="text-white font-semibold text-[28px] lg:text-[38px]">
						Simple Secure Efficient
					</h1>
				</div>
				<div className="grid gap-10  lg:grid-cols-3">
					<div className="lg:space-y-4 space-y-2">
						<img src={Img1} alt="" />
						<p className="text-green-500 font-medium">Step 1</p>
						<h3 className="lg:text-[28px] text-[22px] text-white font-semibold">
							Upload documents
						</h3>
						<p className="text-white">
							Create your job in minutes and upload all relevant documents with
							ease.
						</p>
					</div>
					<div className="lg:space-y-4 space-y-2">
						<img src={Img2} alt="" />
						<p className="text-green-500 font-medium">Step 2</p>
						<h3 className="lg:text-[25px] text-[22px] text-white font-semibold">
							Review and Process
						</h3>
						<p className="text-white">
							Chat with your process server and get real-time updates at every
							step.
						</p>
					</div>
					<div className="lg:space-y-4 space-y-2">
						<img className="lg:h-20" src={Img3} alt="" />
						<p className="text-green-500 font-medium">Step 3</p>
						<h3 className="lg:text-[28px] text-[22px] text-white font-semibold">
							Receive Completed Documents 
						</h3>
						<p className="text-white">
							Get affidavits for each attempt, complete with photos, precise
							location data, and detailed server notes.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Steps;
