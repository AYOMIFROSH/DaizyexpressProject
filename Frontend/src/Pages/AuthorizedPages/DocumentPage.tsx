import Sidebar from "../../Components/Dashboard/Sidebar"
import Top from "../../Components/Dashboard/Top"
import Table from "../../Components/Table"

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