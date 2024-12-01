import Sidebar from "../../Components/Dashboard/Sidebar"
import Top from "../../Components/Dashboard/Top"
import UploadForm from "../../Components/Dashboard/UploadForm"

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