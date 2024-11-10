import { Link } from "react-router-dom";
import Input from "../Components/Input";

const Login = () => {
	return (
		<div className="pt-16 px-6">
			<div className="max-w-[600px] mx-auto ">
				<div className="flex flex-col lg:flex-row justify-between items-center">
					<div></div>
					<div className="flex items-center gap-x-2">
						<p className="font-semibold">Don't have an account yet?</p>
						<Link
							to={"/register"}
							className="text-blue-500 font-semibold cursor-pointer"
						>
							Sign Up
						</Link>
					</div>
				</div>

				<div className="lg:pt-[180px] pt-[100px] max-w-[500px] space-y-10 mx-auto">
					<h1 className="font-medium text-[36px] text-center">Welcome Back</h1>

					<div className="flex flex-col gap-y-4">
						<Input name="Email address" />
						<Input name="Password" />
						<button className="border border-yellow-500 lg:text-base text-[14px] w-full bg-yellow-300 px-4 duration-500 hover:bg-yellow-500/80 font-semibold rounded-[8px] lg:py-2 py-2">
							Sign In
						</button>
						<p className="text-blue-500 lg:text-base text-[14px] -mt-2 text-center font-semibold cursor-pointer">
							Forgot Password
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
