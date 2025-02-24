import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordValues {
  email: string;
}

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL =
        window.location.hostname === "localhost"
          ? "http://localhost:3000" // Localhost environment
          : "https://daizyexserver.vercel.app"; // Production environment


  const forgotPassword = async (values: ForgotPasswordValues) => {
    try {
      setLoading(true);
      // const response = await fetch(`http://localhost:3000/api/auth/forgotpassword`, {
      const response = await fetch(`${baseURL}/api/auth/forgotpassword`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send reset email");
      }

      navigate("/check-email");

    } catch (err: any) {
      message.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading };
};
