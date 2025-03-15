const PageTitle = ({ title ,children }) => {
    return (
    <>
      <div className="bg-gradient-to-r from-sky-600 via-sky-600/80 to-sky-600 text-white p-3 text-center rounded-lg shadow-md mt-6 mb-2 relative overflow-hidden w-4/5 mx-auto">
        <div className="absolute inset-0 bg-opacity-20 bg-gray-50 pointer-events-none" />
        <h1 className="text-2xl font-extrabold tracking-wide relative z-10">{title}</h1>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-16 bg-sky-500 rounded-full"></div>
      </div>

      <div className="p-4 bg-slate-100 border border-slate-300/80 rounded-lg overflow-hidden shadow-lg">
            {children}
      </div>
    </>
    );
  };
  
  export default PageTitle;
  