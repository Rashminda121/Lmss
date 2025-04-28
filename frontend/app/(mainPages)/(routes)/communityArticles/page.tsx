"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { FaArrowRight, FaBan } from "react-icons/fa";

interface Article {
  _id: string;
  uid: string;
  title: string;
  description: string;
  image: string;
  url: string;
  author: string;
  category: string;
}

const CommunityArticles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleArticles, setVisibleArticles] = useState(6);
  const [data, setData] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedData = useRef(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/admin/listArticles"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to fetch articles",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      getData();
      hasFetchedData.current = true;
    }
  }, []);

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

  const filteredArticles = data
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

  // Skeleton loader for articles
  const ArticleSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      <div className="relative h-52 bg-gray-200"></div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex items-center mt-6">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-10 mt-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            No articles found
          </h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
              }}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
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
                key={article._id}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={
                      article.image ||
                      "https://source.unsplash.com/featured/?technology"
                    }
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://source.unsplash.com/featured/?technology";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs bg-blue-600/90 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 w-full max-h-24 overflow-y-auto p-2 no-scrollbar">
                    {article.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {article.author || "Unknown Author"}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
                    >
                      {article.url ? (
                        <div className="flex items-center text-white hover:underline text-sm">
                          Read Article
                          <FaArrowRight className="h-4 w-4 ml-2" />
                        </div>
                      ) : (
                        <div className="flex items-center text-white text-sm opacity-50 cursor-not-allowed">
                          No URL
                          <FaBan className="h-4 w-4 ml-2" />
                        </div>
                      )}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleArticles < data.length &&
            filteredArticles.length >= visibleArticles && (
              <div className="mt-16 text-center">
                <button
                  onClick={loadMoreArticles}
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                >
                  Load More Articles
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default CommunityArticles;
