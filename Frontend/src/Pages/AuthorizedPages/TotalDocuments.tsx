import DocumentsDetails from "../../Components/DashboardAdmin/DocumentsDetails"
import Sidebar from "../../Components/Sidebar"
import Top from "../../Components/Top"

const TotalDocuments = () => {
  return (
    <div className="bg-gray-100">
        <Top isAdmin={true} />
        <div className="flex">
            <Sidebar isAdmin={true} />
            <DocumentsDetails />
        </div>
    </div>
  )
}

export default TotalDocuments