"use client";
import React, { useState } from "react";

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
    category: "React",
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
    category: "CSS",
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
    category: "JavaScript",
  },
  {
    id: 4,
    title: "The Complete Guide to Next.js",
    description:
      "Master server-side rendering, static generation, and API routes with Next.js.",
    image: "https://source.unsplash.com/featured/?nextjs",
    link: "#",
    date: "June 18, 2023",
    readTime: "10 min read",
    author: "Emma Davis",
    likes: 210,
    comments: 35,
    category: "React",
  },
  {
    id: 5,
    title: "State Management in 2023",
    description:
      "Comparing Redux, Context API, Zustand, and other state management solutions.",
    image: "https://source.unsplash.com/featured/?code",
    link: "#",
    date: "July 5, 2023",
    readTime: "8 min read",
    author: "James Rodriguez",
    likes: 178,
    comments: 47,
    category: "Frontend",
  },
  {
    id: 6,
    title: "TypeScript Best Practices",
    description:
      "Learn how to write cleaner, more maintainable TypeScript code with these patterns.",
    image: "https://source.unsplash.com/featured/?typescript",
    link: "#",
    date: "July 12, 2023",
    readTime: "6 min read",
    author: "Sophia Kim",
    likes: 145,
    comments: 22,
    category: "TypeScript",
  },
  {
    id: 7,
    title: "TypeScript Best Practices",
    description:
      "Learn how to write cleaner, more maintainable TypeScript code with these patterns.",
    image: "https://source.unsplash.com/featured/?typescript",
    link: "#",
    date: "July 12, 2023",
    readTime: "6 min read",
    author: "Sophia Kim",
    likes: 145,
    comments: 22,
    category: "TypeScript",
  },
];

const CommunityArticles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleArticles, setVisibleArticles] = useState(6);

  const categories = [
    "All",
    "General",
    "Technology",
    "Health",
    "Education",
    "Skills",
    "Careers",
    "Other",
  ];

  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;

      return matchesSearch && matchesCategory;
    })
    .slice(0, visibleArticles);

  const loadMoreArticles = () => {
    setVisibleArticles((prev) => prev + 3);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Community Knowledge
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insights from educators and learners in our community
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search articles by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No articles found
          </h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <span className="bg-blue-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {article.readTime}
                    </span>
                    {article.likes > 100 && (
                      <span className="bg-green-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">
                      {article.date}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {article.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <span className="flex items-center">
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
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group/read"
                    >
                      Read
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 transition-transform duration-200 group-hover/read:translate-x-1"
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

          {visibleArticles < articles.length && (
            <div className="mt-16 text-center">
              <button
                onClick={loadMoreArticles}
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 hover:shadow-md"
              >
                Browse More Articles
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommunityArticles;
