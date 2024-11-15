import Img from "../../assets/phone.avif";

const Process = () => {
	return (
		<div className="px-10 pt-20">
			<div className="max-w-[1240px] grid grid-cols-2 mx-auto">
				<div className="flex flex-col w-[85%] items-start gap-y-6 justify-center">
					<h2 className="text-yellow-500 font-semibold text-[18px]">
						FOR PROCESS SERVERS
					</h2>
					<h2 className="text-[45px] leading-[50px] font-semibold">
						Make money by becoming a process server with Proof
					</h2>
					<p>
						With Proof, you’ll get notified of nearby jobs, all managed through
						the highest-rated process serving app in the industry. Our efficient
						platform and operations team empower you to succeed on every job.
					</p>
					<p className="border-b-4 cursor-pointer font-medium hover:border-black duration-500">Become a process server with Proof</p>
				</div>
				<img src={Img} alt="" />
			</div>
		</div>
	);
};

export default Process;
