import Analytic from "../../Components/DashboardAdmin/Analytics";
import Sidebar from "../../Components/Sidebar";
import Top from "../../Components/Top";


const AdminPages = () => {
    return (
      <div className="bg-gray-100">
        <Top isAdmin={true} />
        <div className="flex ">
          <Sidebar isAdmin ={true} />
          <Analytic />
        </div>
      </div>
    )
  }
  
  export default AdminPages