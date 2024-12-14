import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";

const CheckEmailPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-[400px] text-center">
        <MailOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
        <h1 className="text-2xl font-semibold mt-4">Check Your Email</h1>
        <p className="text-gray-600 mt-2">
          We have sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password.
        </p>
        <Button
          type="primary"
          size="large"
          className="mt-6 w-full"
          onClick={handleLoginRedirect}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default CheckEmailPage;
