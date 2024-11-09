import Input from "../Components/Input";

const Login = () => {
	return (
		<div className="pt-16">
			<div className="max-w-[600px] mx-auto ">
				<div className="flex justify-between items-center">
					<div></div>
					<div className="flex items-center gap-x-2">
						<p className="font-semibold">Don't have an account yet?</p>
						<p className="text-blue-500 font-semibold cursor-pointer">
							Sign Up
                        </p>
                        
					</div>
				</div>

				<div className="pt-[180px] max-w-[500px] space-y-10 mx-auto">
					<h1 className="font-medium text-[36px] text-center">Welcome Back</h1>

					<div className="flex flex-col gap-y-4">
						<Input name="Email address" />
						<Input name="Password" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
