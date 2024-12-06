import Sidebar from "../../Components/Sidebar"
import Top from "../../Components/Top"
import Table from "../../Components/DashboardUser/Table"

const DocumentPage = () => {
  return (
    <>
    <Top isAdmin={false} />
    <div className="flex">
        <Sidebar isAdmin={false} />
        <div className="flex flex-col">
          <Table isHome = {true} />
        </div>
    </div>
    </>
  )
}

export default DocumentPage