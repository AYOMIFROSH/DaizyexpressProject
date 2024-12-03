import Sidebar from "../../Components/Sidebar"
import Top from "../../Components/Top"
import Table from "../../Components/DashboardUser/Table"

const DocumentPage = () => {
  return (
    <>
    <Top isAdmin={false} />
    <div className="flex">
        <Sidebar isAdmin={false} />
        <Table isHome = {true} />
    </div>
    </>
  )
}

export default DocumentPage