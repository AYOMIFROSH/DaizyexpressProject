import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spin, message } from "antd";
import Input from "../Components/Input";
import UseRegister from "../Hooks/useSignup";
import "../index.css";

type FormValues = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Errors = {
  userName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const SignUp = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    userName: "", // Ensure this key matches everywhere
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const { loading, error, registeruser } = UseRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log("Input change:", name, value); // Check if this logs correctly
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = () => {
    const newErrors: Errors = {};
    if (!formValues.userName) newErrors.userName = "Username is required";
    if (!formValues.email) newErrors.email = "Email address is required";
    if (!formValues.password) newErrors.password = "Password is required";
    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      registeruser({
        userName: formValues.userName, // Ensure this matches the backend expectations
        email: formValues.email,
        password: formValues.password,
        passwordConfirm: formValues.confirmPassword,
      });
    }
  };

  useEffect(() => {
    if (error) {
      message.error({
        className: "antd-error",
        content: error,
      });
    }
  }, [error]);

  return (
    <div className="pt-16 px-6">
      <div className="max-w-[600px] mx-auto ">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div></div>
          <div className="flex items-center gap-x-2">
            <p className="font-semibold">Already Have an Account?</p>
            <Link to={"/login"} className="text-blue-500 font-semibold cursor-pointer">
              Login
            </Link>
          </div>
        </div>

        <div className="lg:pt-32 pt-[100px] max-w-[500px] space-y-10 mx-auto">
          <h1 className="font-medium text-[36px] text-center">Welcome Back</h1>

          <div className="flex flex-col gap-y-4 pb-10">
            <Input
              name="userName" // Ensure the name matches state property
              label="Username"
              value={formValues.userName}
              onChange={handleChange}
              error={errors.userName}
            />
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
            <Input
              name="confirmPassword"
              label="Confirm Password"
              value={formValues.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
            <button
              onClick={handleSubmit}
              className="border border-yellow-500 lg:text-base text-[14px] w-full bg-yellow-300 px-4 duration-500 hover:bg-yellow-500/80 font-semibold rounded-[8px] lg:py-2 py-2"
              disabled={loading}
            >
              {loading ? <Spin /> : "Sign Up"}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;


