import Img from "../../assets/serve.avif";

const Serve = () => {
	return (
		<div className="px-10">
			<div className="max-w-[1240px] grid grid-cols-2 mx-auto">
				<div className="flex flex-col w-[85%] gap-y-6 justify-center">
					<h2 className="text-[45px] leading-[50px] font-semibold">
						Get a dedicated Proof Specialist with every serve
					</h2>
					<p>
						From fast updates to quick problem-solving, your dedicated
						specialist ensures a smooth process, giving you peace of mind.
					</p>
				</div>
				<img src={Img} alt="" />
			</div>
		</div>
	);
};

export default Serve;
