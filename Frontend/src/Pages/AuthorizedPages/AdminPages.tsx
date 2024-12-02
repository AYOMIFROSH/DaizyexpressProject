import Analytic from "../../Components/DashboardAdmin/Analytics";
import Sidebar from "../../Components/Sidebar";
import Top from "../../Components/Top";


const AdminPages = () => {
    return (
      <>
        <Top isAdmin={true} />
        <div className="flex ">
          <Sidebar isAdmin ={true} />
          <Analytic />
        </div>
        
      </>
    )
  }
  
  export default AdminPages