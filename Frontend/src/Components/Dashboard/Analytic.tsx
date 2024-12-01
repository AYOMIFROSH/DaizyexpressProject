import Cards from "../Cards"
import Table from "../Table"
import { Link } from "react-router-dom";

import { IoDocumentTextOutline } from "react-icons/io5";
const Analytic = () => {
  return (
    <section className="mt-32 px-6">
        <div className="flex flex-col">
            <h1 className="font-bold text-3xl text-[#5A5C69]">Dashboard</h1>
            <div className="flex items-center gap-5 mt-10 max-sm:flex-col max-sm:items-start">
                <Cards title="Total Document" icon={<IoDocumentTextOutline />} number= "5" />
                <Cards title="Processed Document" icon={<IoDocumentTextOutline />} number= "4" />
            </div>
            <div className="flex flex-col">
                <h1 className="font-bold text-3xl text-[#5A5C69] mt-32">Documents</h1>
                    <Table />
            </div>
            <div className="flex items-center justify-center my-10">
            <Link to="/document" className="px-5 py-2.5 rounded-[5px] bg-yellow-300 text-white font-semibold">
				How it works
			</Link>
            </div>
        </div>
    </section>
  )
}

export default Analytic