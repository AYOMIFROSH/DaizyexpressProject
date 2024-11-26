import Sidebar from "../Components/Dashboard/Sidebar";
import Performance from "../Components/Dashboard/Performance";
import Main from "../Components/Dashboard/Main";
import Content from "../Components/Dashboard/Content";
import Revenue from "../Components/Dashboard/Revenue";
import Count from "../Components/Dashboard/Count";
import CreateJob from "../Components/Dashboard/CreateJob";





const Dashboard = () => {
  return (
    <div className="flex item-center">
      <Sidebar />
      <Main>
        <Performance />
        <Content>
        <Revenue />
        <Count />
        </Content>
        <CreateJob />
      </Main>
    </div>
  )
}

export default Dashboard
