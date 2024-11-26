
// type jobData = {
//     label: string,
//     value: number
// }


// const Table = () => {
//     const data: jobData[] = [
//         { label: "Yesterday", value: 0 },
//         { label: "This Month", value: 1 },
//         { label: "Last Month", value: 0 },
//         { label: "This Year", value: 1 },
//         { label: "Last Year", value: 0 },
//       ];
    
//       return (
//         <div className="bg-white rounded-lg shadow-md p-4 min-w-[300px]">
//             <div className="flex items-start justify-between">
//                 <div className="flex flex-col gap-3">
//                     <span className="text-[18px] text-[#9CA7B9]">Jobs Created</span>
//                     <h5 className="font-bold text-2xl underline">1</h5>
//                 </div>
//                 <div className="flex items-center space-y-2 flex-col">
//                     {data.map((item, index)=>(
//                         <div className="flex items-center" key={index}>
//                             <p className="mr-3 flex flex-col items-center underline">{item.value}</p>
//                             <p className="flex-1 me-3 text-[18px]">{item.label}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//       );
// }

// export default Table

const JobsCreated = () => {
    const data = [
      { label: "Yesterday", value: 0 },
      { label: "This Month", value: 1 },
      { label: "Last Month", value: 0 },
      { label: "This Year", value: 1 },
      { label: "Last Year", value: 0 },
    ];
  
    return (
      <div className="bg-white rounded-lg shadow-md p-4 w-[300px]">
        <h3 className="text-[#9CA7B9] font-medium text-sm">Jobs Created</h3>
        <div className="mt-2">
          <span className="text-4xl font-bold text-black">1</span>
          <div className="h-[1px] bg-gray-200 w-full my-2"></div>
        </div>
        <div className="flex flex-col space-y-2 text-sm">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-[#9CA7B9]">{item.value}</span>
              <span className="text-black">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default JobsCreated;
  