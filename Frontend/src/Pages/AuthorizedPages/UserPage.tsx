import Analytic from "../../Components/DashboardUser/Analytic";
import Sidebar from "../../Components/Sidebar";
import Top from "../../Components/Top";
import PaymentForm from "./PaymentForm";


const UserPage = () => {
    return (
      <>
      <PaymentForm/>
        <Top isAdmin={false} />
        <div className="flex ">
          <Sidebar isAdmin = {false} />
          <div className="flex flex-col">
          <Analytic />
          </div>
        </div>
        
      </>
    )
  }
  
  export default UserPage