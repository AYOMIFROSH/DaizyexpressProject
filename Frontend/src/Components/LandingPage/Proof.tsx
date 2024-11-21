import img1 from '../../assets/img1.svg'
import img2 from '../../assets/img2.svg'
import img3 from '../../assets/img3.svg'
import img4 from '../../assets/img4.svg'
const Proof = () => {
	return (
		<div className="lg:px-10 px-5 pt-20 pb-32">
			<div className="max-w-[1240px] mx-auto">
				<div className="flex lg:flex-row flex-col gap-y-4 lg:items-center justify-between">
					<h2 className="font-semibold text-[18px] lg:text-[28px]">As seen in</h2>
					{/* <div className="flex items-center lg:gap-x-8 justify-between">
						<img className="lg:h-[75px] w-[20%] object-cover" src={img2} alt="" />
						<img className="lg:h-[75px] w-[20%] object-cover" src={img2} alt="" />
						<img className="lg:h-[75px] w-[20%] object-cover" src={img3} alt="" />
						<img className="lg:h-[75px] w-[20%] object-cover" src={img4} alt="" />
					</div> */}
				</div>

				<div className="lg:pt-20 pt-16">
					<h2 className="lg:text-3xl text-2xl font-semibold">Expert Legal Document Processing Services </h2>

					<div className="grid lg:grid-cols-2  gap-y-6 pt-10">
						<div className="relative  lg:mr-10 ">
							<img
								className="lg:h-[500px] h-[300px] z-[-9] object-cover"
								src={img1}
								alt=""
							/>
							<div className="absolute top-0 left-0 w-full h-full bg-[#1a2b3a6e]" />

							<div className="absolute flex flex-col items-start justify-end top-0 left-0 w-full h-full p-8 lg:p-14">
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
						<div className="lg:pl-8 lg:border-dashed flex flex-col justify-center lg:border-l ">
							<div className="flex items-center border-dashed border-b gap-x-6 pb-8">
								<img className="size-[120px] object-cover" src={img2} alt="" />
								<div>
									<p className="text-[20px] font-semibold">
										Document scanning and digitization
									</p>
									<p>3 min read</p>
								</div>
							</div>
							<div className="flex items-center pt-6 border-dashed border-b gap-x-6 pb-8">
								<img className="size-[120px] object-cover" src={img3} alt="" />
								<div>
									<p className="text-[20px] font-semibold">
										OCR and data extraction 
									</p>
									<p>3 min read</p>
								</div>
							</div>
							<div className="flex items-center pt-6 gap-x-6">
								<img className="size-[120px] object-cover" src={img4} alt="" />
								<div>
									<p className="text-[20px] font-semibold">
										E-filing and court services
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
