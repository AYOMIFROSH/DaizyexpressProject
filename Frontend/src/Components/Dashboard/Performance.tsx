import PieChat from "./PieChat"
const Performance = () => {
  return (
    <div className="pt-32">
      <div className="flex flex-col">
        {/* the title here is dynamic, the name of the company that is registerd with would display as the title below */}
        <h2 className="font-medium font-sans text-2xl">Name of Company Dashboard</h2>
        <div className="flex flex-col bg-white box w-full p-6 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h5 className="text-[#9CA7B9] text-[20px] font-medium">Performance Metrics</h5>
            <div className="flex items-center gap-5">
              <span className="text-[#2A77C9] bg-[#DFEBF9] border-2 border-[#2A77C9] px-2 py-1 rounded-full">Month</span>
              <span className="text-[#1B935B] bg-[#DAF7EA] border-2 border-[#DAF7EA] px-2 py-1 rounded-full">Year</span>
              <span className="text-[#968204] bg-[#FFF197] border-2 border-[#FFF197] px-2 py-1 rounded-full">Custom</span>
            </div>
          </div>
            <div className="flex items-center gap-10 mt-10">
              <PieChat title="Assignment" />
              <PieChat title="1st Attempt " />
              <PieChat title="Proofs" />
              <PieChat title="Mobile" />
              <PieChat title="Invoice " />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Performance