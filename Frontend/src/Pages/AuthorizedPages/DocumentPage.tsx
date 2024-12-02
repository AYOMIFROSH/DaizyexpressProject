import Sidebar from "../../Components/Sidebar"
import Top from "../../Components/Top"
import Table from "../../Components/DashboardUser/Table"

const DocumentPage = () => {
  return (
    <>
    <Top />
    <div className="flex">
        <Sidebar />
        <Table isHome = {true} />
    </div>
    </>
  )
}

export default DocumentPage