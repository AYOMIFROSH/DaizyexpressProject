import img7 from "../../assets/img7.png";
import { FaCheck } from "react-icons/fa";

const Process = () => {
  return (
    <div className="lg:px-10 px-5 pt-20">
      <div className="max-w-[1240px]  grid gap-y-7 lg:grid-cols-2 mx-auto">
        <div className="flex flex-col lg:w-[85%] items-start gap-y-4 lg:gap-y-6 justify-center pl-6">
          <h2 className="text-yellow-300 font-semibold text-2xl lg:text-3xl">
            Why choose Deizyexpress?
          </h2>
        

          <div className="block mt-5 ">
            <ol className="space-y-4 ">
              <li className="flex items-center gap-3"><span className="text-yellow-300 text-2xl mr-2"><FaCheck className="text-xl" /></span>Fast turnaround times</li>
              <li className="flex items-center gap-3"><span className="text-yellow-300 text-2xl mr-2"><FaCheck className="text-xl" /></span>High accuracy rates</li>
              <li className="flex items-center gap-3"><span className="text-yellow-300 text-2xl mr-2"><FaCheck className="text-xl" /></span>Secure and confidential processing</li>
              <li className="flex items-center gap-3"><span className="text-yellow-300 text-2xl mr-2"><FaCheck className="text-xl" /></span>Cost-effective solutions</li>
              <li className="flex items-center gap-3"><span className="text-yellow-300 text-2xl mr-2"><FaCheck className="text-xl" /></span>Expert customer support</li>
            </ol>
          </div>
        </div>
        <img src={img7} alt="" />
      </div>
    </div>
  );
};

export default Process;
