import Analytic from "../Components/Dashboard/Analytic";
import Sidebar from "../Components/Dashboard/Sidebar";
import Top from "../Components/Dashboard/Top";

const Dashboard = () => {
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

export default Dashboard
