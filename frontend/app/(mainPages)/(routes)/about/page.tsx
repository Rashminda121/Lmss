"use client";
import {
  FaGraduationCap,
  FaUsers,
  FaChartLine,
  FaSyncAlt,
  FaQuoteLeft,
} from "react-icons/fa";
import { GiLightBulb, GiBookshelf } from "react-icons/gi";
import { motion } from "framer-motion";

const UserAbout = () => {
  const features = [
    {
      icon: <FaGraduationCap className="text-3xl" />,
      title: "Personalized Learning",
      description:
        "Learn at your own pace with content tailored to your style and level.",
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: "Collaborative Environment",
      description:
        "Engage with peers and educators through discussions and group projects.",
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Progress Tracking",
      description:
        "Get real-time insights into your learning journey with smart analytics.",
    },
    {
      icon: <FaSyncAlt className="text-3xl" />,
      title: "Flexible System",
      description:
        "Access courses anytime, anywhere, fitting education into your schedule.",
    },
  ];

  const quotes = [
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela",
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King",
    },
    {
      text: "Your education is a dress rehearsal for a life that is yours to lead.",
      author: "Nora Ephron",
    },
    {
      text: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleRedirect = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen md:mt-5 bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with animated decoration */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 relative"
        >
          <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-indigo-100 opacity-70"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-100 opacity-50"></div>
          <h1 className="text-5xl font-bold text-indigo-900 mb-6 relative z-10">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Lumina
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto relative z-10 leading-relaxed">
            Transforming education through intuitive technology and
            collaborative learning experiences.
          </p>
          <GiBookshelf className="mx-auto mt-8 text-4xl text-indigo-400" />
        </motion.div>

        {/* Features Grid with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-indigo-100 group"
            >
              <div className="text-indigo-600 mb-6 group-hover:text-indigo-700 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mission Section with gradient background */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden mb-24"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-500 opacity-90"></div>
          <div className="relative z-10 p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <GiLightBulb className="text-5xl mr-6 text-yellow-300" />
                <h2 className="text-2xl md:text-4xl font-bold">
                  Our Vision for Education
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-base md:text-lg mb-6 leading-relaxed">
                    We believe learning should be accessible, engaging, and
                    tailored to individual needs. Lumina combines cutting-edge
                    technology with educational expertise to create meaningful
                    learning experiences.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed">
                    Our platform adapts to different learning styles while
                    fostering collaboration between students and educators.
                  </p>
                </div>
                <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                  <h3 className="text-lg md:text-xl font-semibold mb-4">
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-3">•</span>
                      <span>Personalized learning paths</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-3">•</span>
                      <span>Real-time progress analytics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-3">•</span>
                      <span>Interactive course materials</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-3">•</span>
                      <span>Seamless communication tools</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quotes Section with elegant cards */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Inspiration For Learners
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Words that motivate us to keep learning and growing every day
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotes.map((quote, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <FaQuoteLeft className="text-3xl text-indigo-200 mb-4" />
                <p className="text-lg md:text-xl italic text-gray-700 mb-6 leading-relaxed">
                  "{quote.text}"
                </p>
                <p className="font-medium text-indigo-600">— {quote.author}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing CTA with floating animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-white rounded-2xl shadow-lg p-12 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-indigo-100 opacity-40"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-100 opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                elevate
              </span>{" "}
              your learning?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Join our community of passionate learners and educators today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRedirect}
              className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Journey
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserAbout;
