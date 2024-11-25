import Sidebar from "../Components/Dashboard/Sidebar";
import Performance from "../Components/Dashboard/Performance";
import Main from "../Components/Dashboard/Main";
import Content from "../Components/Dashboard/Content";




const Dashboard = () => {
  return (
    <div className="flex item-center">
      <Sidebar />
      <Main>
        <Content>
          <Performance />
        </Content>
      </Main>
    </div>
  )
}

export default Dashboard
