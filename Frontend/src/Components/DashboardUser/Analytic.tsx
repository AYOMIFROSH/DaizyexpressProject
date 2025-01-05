import Cards from "./Cards"
import { Link } from "react-router-dom";

import { IoDocumentTextOutline } from "react-icons/io5";
const Analytic = () => {
  return (
    <section className="mt-32 px-6">
        <div className="flex flex-col">
            <h1 className="font-bold text-3xl text-[#5A5C69] max-md:text-2xl max-sm:text-[20px]">Dashboard</h1>
            
            <div className="flex items-center gap-5 mt-10 max-sm:flex-col max-sm:items-start">
                <Cards title="Total Document" icon={<IoDocumentTextOutline />} number= "0" />
                <Cards title="Processed Document" icon={<IoDocumentTextOutline />} number= "0" />
            </div>
            <div className="flex items-center justify-center my-10">
            <Link to="/document" className="px-5 py-2.5 rounded-[5px] bg-yellow-300 text-white font-semibold">
				View Documents
			</Link>
            </div>
        </div>
    </section>
  )
}

export default Analytic