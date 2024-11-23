import Sidebar from "../Components/Dashboard/Sidebar";
import Performance from "../Components/Dashboard/Performance";




const Dashboard = () => {
  return (
    <div className="flex item-center gap-10">
      <Sidebar />
      <Performance />
    </div>
  )
}

export default Dashboard
