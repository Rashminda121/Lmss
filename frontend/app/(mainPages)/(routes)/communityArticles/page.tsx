import React from "react";

const articles = [
  {
    id: 1,
    title: "Exploring React 18 Features",
    description:
      "Learn about the latest features in React 18, including automatic batching and concurrent rendering.",
    image: "https://source.unsplash.com/featured/?react",
    link: "#",
    date: "May 15, 2023",
    readTime: "5 min read",
    author: "Sarah Johnson",
    likes: 124,
    comments: 28,
  },
  {
    id: 2,
    title: "Tailwind CSS Tips & Tricks",
    description:
      "Boost your UI development with these essential Tailwind CSS techniques and shortcuts.",
    image: "https://source.unsplash.com/featured/?tailwindcss",
    link: "#",
    date: "June 2, 2023",
    readTime: "4 min read",
    author: "Michael Chen",
    likes: 89,
    comments: 15,
  },
  {
    id: 3,
    title: "Understanding JavaScript Closures",
    description:
      "A deep dive into closures in JavaScript with practical examples and use cases.",
    image: "https://source.unsplash.com/featured/?javascript",
    link: "#",
    date: "June 10, 2023",
    readTime: "7 min read",
    author: "David Wilson",
    likes: 156,
    comments: 42,
  },
];

const CommunityArticles = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Community Knowledge
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insights shared by developers from around our community
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="relative h-60 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {article.readTime}
                </span>
                <span className="bg-green-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Popular
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">{article.date}</span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-4">{article.description}</p>

              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span className="flex items-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {article.author}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex space-x-4">
                  <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {article.likes}
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {article.comments}
                  </button>
                </div>

                <a
                  href={article.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  Read
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200">
          Browse More Articles
        </button>
      </div>
    </div>
  );
};

export default CommunityArticles;
