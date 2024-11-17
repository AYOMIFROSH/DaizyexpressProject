 

const Uploads = () => {
  return (
    <div className="bg-gray-400">
      <div className="min-h-[400px] min-w-[400px] pt-6 items-center flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="block  ">
            <div className="flex  gap-x-4 bg-gray-300 rounded-sm px-4">
              <h1 className="font-semibold text-center text-2xl mr-8 ">
                Uche Otuya
              </h1>

              <button className="border border-green-500 rounded-md px-2 ">
                Jobs
              </button>
              <button className="border border-green-500 rounded-md px-2">
                Server Pay
              </button>
              <button className="  bg-blue-300 px-3 rounded-md">Edit</button>
            </div>
            <div className="border border-white p-2 rounded-b-md">
              <p className="text-xl text-blue-600 font-semibold">
                Permission :
                <span className="text-sm pl-14  text-gray-800">Owner</span>
              </p>
              <p className="text-xl text-blue-600 font-semibold">
                Phone :
                <span className="text-sm pl-14 text-gray-800">2148991771</span>
              </p>
              <p className="text-xl text-blue-600 font-semibold">
                Email :
                <span className="text-sm pl-14 text-gray-800">
                  uchekevin02@gmail.com
                </span>
              </p>
              <p className="text-xl text-blue-600 font-semibold">
                Time Zone :
                <span className="text-sm pl-14 text-gray-800">---</span>
              </p>
              <p className="text-xl text-blue-600 font-semibold">
                Signature :
                <span className="text-sm pl-14 text-gray-800">---</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploads;
