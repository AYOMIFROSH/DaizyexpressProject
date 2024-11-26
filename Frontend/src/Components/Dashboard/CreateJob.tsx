import { Link } from "react-router-dom"
import Table from "../Table"

const CreateJob = () => {
  return (
    <section className="pt-32 relative">
        <div className="flex flex-col items-center justify-center">
        <h4 className="text-[25px] font-bold mb-5">Getting started is easy</h4>
        <p className="text-[18px] font-medium">Create your first job. No instruction manual needed.</p>
        <button className="bg-green-600 px-4 py-3 rounded-md text-white font-medium my-5"><Link to={""}>Create a Job</Link></button>
        </div>
        <div className="grid grid-cols-3 gap-10">
            <Table />
            <Table />
            <Table />
            <Table />
        </div>
    </section>
  )
}

export default CreateJob