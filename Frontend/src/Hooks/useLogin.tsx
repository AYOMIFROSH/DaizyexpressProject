import { useState } from "react";
import { useAuth } from "../Context/useContext";
import { message } from "antd";

interface LoginValues {
  email: string;
  password: string;
}

const useLogin = () => {
  const { login } = useAuth(); // Assuming `login` adds token and user data to context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (values: LoginValues) => {
    try {
      setLoading(true);
      setError(null);
      // const response = await fetch(`http://localhost:3000/api/auth/login`, {
      const response = await fetch(`https://daizyexserver.vercel.app/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user);
        message.success("Logged in successfully!");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err: any) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
};

export default useLogin;
