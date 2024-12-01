import Analytic from "../../Components/Dashboard/Analytic";
import Sidebar from "../../Components/Dashboard/Sidebar";
import Top from "../../Components/Dashboard/Top";


const UserPage = () => {
    return (
      <>
        <Top />
        <div className="flex ">
          <Sidebar />
          <Analytic />
        </div>
        
      </>
    )
  }
  
  export default UserPage