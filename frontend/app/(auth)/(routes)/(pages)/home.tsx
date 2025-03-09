const Home = () => {
  return (
    <div
      className="flex items-center justify-center mt-10 md:mt-0 "
      style={{ height: "auto" }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center w-full p-10 md:p-20">
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-6xl font-extrabold pb-2 md:pb-4">
            Welcome to <span className="text-blue-800">Lumina</span>
          </h1>
          <p className="text-lg md:text-3xl">
            Learn, grow, and never stop exploring.
          </p>
          <div className="mt-4 flex flex-row space-x-3 md:space-x-5">
            <a
              href="https://github.com/Rashminda121"
              className="p-2 md:p-5 border-5 border border-gray-500 rounded-[99px] hover:scale-110 hover:bg-blue-100 transition-all duration-300"
            >
              <img
                src="/socialMedia/github.png"
                alt="github"
                className="w-6 h-6 md:w-8 md:h-8"
              />
            </a>

            <a
              href="mailto:rashmindaeducation@gmail.com"
              className="p-2 md:p-5 border-5 border border-gray-500 rounded-[99px] hover:scale-110 hover:bg-blue-100 transition-all duration-300"
            >
              <img
                src="/socialMedia/gmail.png"
                alt="gmail"
                className="w-6 h-6 md:w-8 md:h-8"
              />
            </a>
            <a
              href="#signIn"
              className="p-2 md:p-5 border-5 border border-gray-500 rounded-[99px] hover:scale-110 hover:bg-blue-100 transition-all duration-300"
            >
              <img
                src="/img3.gif"
                alt="move"
                className="w-6 h-6 md:w-8 md:h-8"
              />
            </a>
          </div>
        </div>
        <div className="flex mt-5 md:mt-0 sm:mt-0">
          <img
            src="/img2.gif"
            alt="home icon"
            className="ml-0 md:ml-5 "
            style={{ width: "550px", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
