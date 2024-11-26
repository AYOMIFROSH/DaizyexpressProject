import PieChat from "../PieChat"
const Performance = () => {
  return (
    <div>
      <div className="flex flex-col">
        <div className="flex flex-col bg-white box w-full p-6 mt-10">
          <div className="flex items-start justify-between mb-5">
            <h5 className="text-[#9CA7B9] text-[18px] font-medium mr-10">Top Companies by Job<br/> Count</h5>
            <div className="flex items-center gap-5">
              <span className="text-[#2A77C9] bg-[#DFEBF9] border-2 border-[#2A77C9] text-[12px] px-2 py-1 rounded-full">Month</span>
              <span className="text-[#1B935B] bg-[#DAF7EA] border-2 border-[#DAF7EA] text-[12px] px-2 py-1 rounded-full">Year</span>
              <span className="text-[#968204] bg-[#FFF197] border-2 border-[#FFF197] text-[12px] px-2 py-1 rounded-full">Custom</span>
            </div>
          </div>
            <div className="flex items-center justify-between gap-24 mt-10">
              <PieChat title="Assignment" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Performance