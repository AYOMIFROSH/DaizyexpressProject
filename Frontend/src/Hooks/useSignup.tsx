import { useState } from "react";
import { useAuth } from "../Context/useContext";
import { message } from "antd";

interface RegisterValues {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const UseRegister = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const registeruser = async (values: RegisterValues) => {
    try {
      setLoading(true);

      const res = await fetch(`https://daizyexserver.vercel.app/api/auth/signup`, {
        // const res = await fetch(`http://localhost:3000/api/auth/signup`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.status === 201) {
        message.success(data.message);
        login(data.token, data.user);
      } else {
        console.error("Signup failed:", data.message);
        setError(data.message);
        message.error(data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Network or server error:", error.message);
      setError(error.message || "An error occurred during registration");
      message.error(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registeruser };
};

export default UseRegister;

