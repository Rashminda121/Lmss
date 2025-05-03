const ContactPage = () => {
  return (
    <div className="p-10 justify-center bg-slate-100 dark:bg-slate-800">
      <div className="relative flex items-center text-center mb-5">
        <h1 className="flex items-center justify-center text-xl md:text-2xl font-semibold flex-grow text-center dark:text-white">
          <img
            src="/headset.png"
            className="w-5 h-5 mr-2 z-10 dark:invert"
            alt="Headset icon"
          />
          Get in Touch
        </h1>
        <a
          href="#"
          className="shadow-gray-300 shadow-lg p-2 md:py-3 rounded-xl absolute right-0 z-10 hover:scale-110 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all duration-300"
        >
          <img
            src="/uparrow.gif"
            className="w-5 h-5 md:w-8 md:h-8 dark:invert"
            alt="Up arrow"
          />
        </a>
      </div>
      <div className="flex justify-center gap-2 mb-5">
        <a
          href="https://github.com/Rashminda121"
          className="p-2 md:p-3 border-5 border border-gray-500 rounded-[99px] hover:scale-110 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all duration-300"
        >
          <img
            src="/socialMedia/github.png"
            alt="github"
            className="w-4 h-4 md:w-6 md:h-6 dark:invert"
          />
        </a>

        <a
          href="mailto:rashmindaeducation@gmail.com"
          className="p-2 md:p-3 border-5 border border-gray-500 rounded-[99px] hover:scale-110 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all duration-300"
        >
          <img
            src="/socialMedia/gmail.png"
            alt="gmail"
            className="w-4 h-4 md:w-6 md:h-6"
          />
        </a>
      </div>
      <div className="flex justify-center mb-5 md:mb-10 px-5 md:px-0">
        <p className="text-xs md:text-base dark:text-white">
          Feel free to contact us for any questions, inquiries, or assistance.
          We're here to help and ensure you have the best experience with
          Lumina.
        </p>
      </div>
      <div className="flex justify-center mb-3 py-5 bg-blue-50 dark:bg-slate-700 rounded-md">
        <p className="text-sm md:text-base text-center text-gray-600 dark:text-gray-300">
          Made for students and educators, supporting learning and growth. ©
          2025{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Lumina.
          </span>
          <span className="block">All rights reserved.</span>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
