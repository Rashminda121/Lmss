import Image from "next/image";

const About = () => {
  return (
    <div className="flex flex-col h-full p-5 md:px-20 md:py-10 justify-center bg-gray-50">
      <div className="relative flex items-center text-center mb-2 md:mb-5">
        <h1 className="flex items-center justify-center text-xl md:text-2xl font-semibold flex-grow text-center">
          <Image
            src="/info.png"
            alt="Info icon"
            width={20}
            height={20}
            className="w-5 h-5 mr-2 z-10"
          />
          About
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="flex justify-center w-full md:w-1/2 ">
          <Image
            src="/about.png"
            alt="About image"
            width={400}
            height={300}
            className="w-[250px] h-auto md:w-[400px]"
          />
        </div>
        <div className="flex items-center justify-center md:w-1/2 mt-2 md:mt-0 text-justify text-xs md:text-base">
          <p>
            Lumina is a simple and effective platform that makes learning easier
            for students and educators. Students can join courses, learn at
            their own pace, and engage in discussions with peers, fostering
            collaboration and knowledge sharing. They have access to a variety
            of resources catering to different learning styles. Educators can
            effortlessly manage courses, track student progress, and provide
            timely support and feedback while creating customized lesson plans
            and assessments. Lumina uses smart technology to offer helpful
            guidance and real-time insights, enhancing the learning experience
            and making it more interactive. Its user-friendly design fosters a
            welcoming environment, encouraging open communication and teamwork.
            By supporting diverse learning needs and providing a flexible
            learning space, Lumina empowers students to reach their full
            potential and helps educators improve their teaching methods, making
            it a valuable resource for any learning environment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
