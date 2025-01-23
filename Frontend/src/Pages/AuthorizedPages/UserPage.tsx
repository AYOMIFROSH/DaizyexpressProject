import { Divider } from "antd";
import Analytic from "../../Components/DashboardUser/Analytic";
import Sidebar from "../../Components/Sidebar";
import Top from "../../Components/Top";
import { useAuth } from "../../Context/useContext";
import PaymentForm from "./PaymentForm";

const UserPage = () => {
  const { isPayed } = useAuth();
  return (
    <>
      {
        <div>
        </div>
      }
      <Top isAdmin={false} />
      <div className="flex ">
        <Sidebar isAdmin={false} />
        <div className="flex flex-col">
          <Analytic />
        </div>
      </div>
    </>
  );
};

export default UserPage;
