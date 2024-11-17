import { Link } from "react-router-dom";

const ForgottenPwd = () => {
  return (
    <div className="pt-16 px-6">
      <div className="max-w-[600px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div></div>
          <div className="flex items-center gap-x-2">
            <p className="font-semibold">Did You Remember Your Password?</p>
            <Link
              to={"/login"}
              className="text-blue-500 font-semibold cursor-pointer"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="lg:pt-[120px] pt-[100px] max-w-[500px] space-y-10 mx-auto">
          <h1 className="font-medium text-[36px] text-center">
            Forgot Password
          </h1>
          <p className="text-center text-sm text-gray-700">
            Please enter your email address below and we`ll send you an email with instructions
          </p>
          <div className="flex flex-col gap-y-4">
            <label className="block">
              <h1 className="font-medium">Email Address</h1>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="border border-[#aaa] w-full px-4 outline-blue-500 duration-500 rounded-[8px] text-[14px] lg:text-base lg:py-2 py-2"
              />
            </label>

            <button className="border border-yellow-500 lg:text-base text-[14px] w-full bg-yellow-300 px-4 duration-500 hover:bg-yellow-500/80 font-semibold rounded-[8px] lg:py-2 py-2 mb-4">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgottenPwd;
