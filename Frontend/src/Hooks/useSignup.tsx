import { useState } from "react";
import { useAuth } from "../Context/useContext";
import { message } from "antd";

interface RegisterValues {
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const UseRegister = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const registeruser = async (values: RegisterValues) => {
    if (values.password !== values.passwordConfirm) {
      return setError("Passwords are not the same");
    }

    try {
      setError(null);
      setLoading(true);

      // const res = await fetch(`http://localhost:3000/api/auth/signup`, {
      const res = await fetch(`https://daizyexserver.vercel.app/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.status === 201) {
        message.success(data.message);
        login(data.token, data.user); // Store token and user data in context
      } else if (res.status === 400) {
        setError(data.message);
      } else {
        message.error("Registration failed");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during registration");
      message.error(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registeruser };
};

export default UseRegister;

