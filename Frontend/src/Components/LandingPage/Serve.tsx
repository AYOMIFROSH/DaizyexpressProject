import Img from "../../assets/serve.avif";

const Serve = () => {
	return (
		<div className="lg:px-10 px-5 py-10 lg:py-20">
			<div className="max-w-[1240px] grid gap-y-7 lg:grid-cols-2 mx-auto">
				<div className="flex flex-col lg:w-[85%] gap-y-4 lg:gap-y-6 justify-center">
					<h2 className="lg:text-[45px] text-[28px] leading-[35px] lg:leading-[50px] font-semibold">
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
