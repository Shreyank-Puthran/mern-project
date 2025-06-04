const DotSpinner = () => {
  return (
    <>
    <div className="flex space-x-2 justify-center items-center my-10">
      <div className="w-4 h-4 bg-[#aa4344] rounded-full animate-ping" style={{ animationDelay: "0s" }}></div>
      <div className="w-4 h-4 bg-[#aa4344] rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
      <div className="w-4 h-4 bg-[#aa4344] rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
    </div>
    </>
  );
};

export default DotSpinner;
