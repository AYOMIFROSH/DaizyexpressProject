import Users from "../../Components/DashboardAdmin/Users"
import Sidebar from "../../Components/Sidebar"
import Top from "../../Components/Top"

const ManageUsers = () => {
  return (
    <div className="bg-gray-100">
        <Top isAdmin={true} />
        <div className="flex">
            <Sidebar isAdmin={true} />
            <Users />
        </div>
    </div>
  )
}

export default ManageUsers