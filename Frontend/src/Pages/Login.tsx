import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spin, message } from "antd";
import Input from "../Components/Input";
import useLogin from "../Hooks/useLogin"; // Import the hook

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

const Login = () => {
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const { loginUser, loading, error } = useLogin(); // Use the hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = () => {
    const newErrors: LoginErrors = {};

    if (!formValues.email) newErrors.email = "Email address is required";
    if (!formValues.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      loginUser(formValues); // Call loginUser from the hook
    }
  };

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <div className="pt-16 px-6">
      <div className="max-w-[600px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div></div>
          <div className="flex items-center gap-x-2">
            <p className="font-semibold">Don't have an account yet?</p>
            <Link to={"/register"} className="text-blue-500 font-semibold cursor-pointer">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="lg:pt-[180px] pt-[100px] max-w-[500px] space-y-10 mx-auto">
          <h1 className="font-medium text-[36px] text-center">Welcome Back</h1>

          <div className="flex flex-col gap-y-4">
            <Input
              name="email"
              label="Email address"
              value={formValues.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              name="password"
              label="Password"
              value={formValues.password}
              onChange={handleChange}
              error={errors.password}
            />
            <button
              onClick={handleSubmit}
              className="border border-yellow-500 lg:text-base text-[14px] w-full bg-yellow-300 px-4 duration-500 hover:bg-yellow-500/80 font-semibold rounded-[8px] lg:py-2 py-2"
              disabled={loading}
            >
              {loading ? <Spin /> : "Sign In"}
            </button>
            <p className="text-blue-500 lg:text-base text-[14px] -mt-2 text-center font-semibold cursor-pointer">
             <Link to={"/forgot"}> Forgot Password</Link> 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
