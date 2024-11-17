import Logo from "../../assets/logo.png";

const NationWide = () => {
	return (
		<div className="bg-[#f6f3f0] py-10 lg:py-20 px-5 ">
			<div className="max-w-[1000px] mx-auto">
				<div className="text-center">
					<h2 className="lg:text-[45px] text-[32px] font-semibold">
						Our Legal Document Processing Services
					</h2>
					<p className="lg:text-[18px] pt-3">
						Our servers are rigorously vetted for experience, jurisdictional
						qualifications, and background checks. They’re not just
						reliable—they’re determined to get the job done right and keep you
						informed along the way.
					</p>
				</div>
					<img className="mx-auto" src={Logo} alt="" />
			</div>
		</div>
	);
};

export default NationWide;
