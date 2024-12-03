import Sidebar from "../../Components/Sidebar"
import Top from "../../Components/Top"
import UploadForm from "../../Components/DashboardUser/UploadForm"

const UploadPage = () => {
  return (
    <>
        <Top isAdmin={false} />
        <div className="flex">
            <Sidebar isAdmin={false} />
            <UploadForm />
        </div>

    </>
  )
}

export default UploadPage