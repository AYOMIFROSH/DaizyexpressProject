import { Card, Button, message } from "antd";
import { useState } from "react";
import { useAuth } from "../../Context/useContext";

const VerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  const userEmail = userData?.email; 

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000" 
      : "https://daizyexserver.vercel.app"; 

  const resendVerification = async () => {
    if (!userEmail) {
      message.error("User email is missing. Please log in again.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();
      
      if (res.ok) {
        message.success(data.message || "Verification email resent successfully!");
      } else {
        message.error(data.message || "Failed to resend verification email.");
      }
    } catch (error) {
      message.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card
        className="w-full max-w-md p-8 shadow-lg"
        title="Verify Your Account"
        bordered={false}
        style={{
          backgroundColor: "#f7fafc",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p className="text-center text-gray-600 mb-4">
          Please check your email to verify your account before proceeding.
        </p>
        <div className="text-center">
          <Button
            type="primary"
            size="large"
            onClick={resendVerification}
            loading={loading}
          >
            Resend Verification Email
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VerificationPage;

