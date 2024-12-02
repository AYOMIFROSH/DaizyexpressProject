import Sidebar from "../../Components/Sidebar"
import Top from "../../Components/Top"
import UploadForm from "../../Components/DashboardUser/UploadForm"

const UploadPage = () => {
  return (
    <>
        <Top />
        <div className="flex">
            <Sidebar />
            <UploadForm />
        </div>

    </>
  )
}

export default UploadPage