"use client";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { ChangeEvent, useState, useEffect } from "react";
import { FaArrowRight, FaComments, FaPlus, FaUser } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import AddDiscussion from "./components/AddDiscussion";
import Swal from "sweetalert2";

interface Discussion {
  id: number;
  title: string;
  author: string;
  date: string;
  comments: number;
  category: string;
  excerpt: string;
}

const mockDiscussions: Discussion[] = [
  {
    id: 1,
    title: "How to integrate Firebase with Next.js?",
    author: "Jane Doe",
    date: "April 15, 2025",
    comments: 5,
    category: "Next.js",
    excerpt:
      "Looking for best practices to integrate Firebase authentication and database with a Next.js application...",
  },
  {
    id: 2,
    title: "Best practices for responsive UI design",
    author: "John Smith",
    date: "April 17, 2025",
    comments: 2,
    category: "UI/UX",
    excerpt:
      "Share your tips and tricks for creating fluid responsive layouts that work across all device sizes... looking for inspiration and examples. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 3,
    title: "Deploying React apps on Vercel",
    author: "Alice Johnson",
    date: "April 19, 2025",
    comments: 8,
    category: "Deployment",
    excerpt:
      "Step-by-step guide to deploying your React application on Vercel with optimal configuration...",
  },
  {
    id: 4,
    title: "Deploying React apps on Vercel",
    author: "Alice Johnson",
    date: "April 19, 2025",
    comments: 8,
    category: "Deployment",
    excerpt:
      "Step-by-step guide to deploying your React application on Vercel with optimal configuration...",
  },
  {
    id: 5,
    title: "Deploying React apps on Vercel",
    author: "Alice Johnson",
    date: "April 19, 2025",
    comments: 8,
    category: "Deployment",
    excerpt:
      "Step-by-step guide to deploying your React application on Vercel with optimal configuration...",
  },
  {
    id: 6,
    title: "Deploying React apps on Vercel",
    author: "Alice Johnson",
    date: "April 19, 2025",
    comments: 8,
    category: "Deployment",
    excerpt:
      "Step-by-step guide to deploying your React application on Vercel with optimal configuration...",
  },
];

const Discussions = () => {
  const [view, setView] = useState<"all" | "mine">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        title: "",
        description: "",
        category: "general",
        email: user?.emailAddresses[0]?.emailAddress || "",
      });
    }
  }, [isModalOpen]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    email: user?.emailAddresses[0]?.emailAddress || "",
  });

  const categories: string[] = [
    "All",
    "General",
    "Courses",
    "Resources",
    "Help",
    "Ideas",
  ];

  const filteredDiscussions = mockDiscussions.filter(
    (d: Discussion) =>
      (view === "all" || d.author === "Jane Doe") &&
      (categoryFilter === "All" || d.category === categoryFilter)
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.emailAddresses[0]?.emailAddress) {
      console.error("No user email found.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/user/addDiscussion",
        formData
      );

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Discussion added successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__bounceInDown",
        },
        hideClass: {
          popup: "animate__animated animate__bounceOutUp",
        },
      });

      setIsModalOpen(false);
      clearForm();
    } catch (error: any) {
      console.error("Failed to submit discussion:", error);

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to submit discussion. Please try again.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__bounceInDown",
        },
        hideClass: {
          popup: "animate__animated animate__bounceOutUp",
        },
      });
    }
  };

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "general",
      email: user?.emailAddresses[0]?.emailAddress || "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Fixed Header Section */}
      <div className="bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Community Discussions
              </h1>
              <p className="text-gray-500 text-sm">
                Join the conversation and share your knowledge
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={categoryFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCategoryFilter(e.target.value)
                }
              >
                {categories.map((cat: string, idx: number) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm shadow-md"
              >
                <FaPlus className="text-xs" />
                <span>New Discussion</span>
              </button>
            </div>
          </div>

          {/* Toggle Menu */}
          <div className="mt-4 flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              className={`px-3 py-1.5 rounded-md text-sm flex-1 transition-all ${
                view === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setView("all")}
            >
              All Discussions
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm flex-1 transition-all ${
                view === "mine"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setView("mine")}
            >
              My Discussions
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Discussion Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
            {/* Custom scrollbar styling */}
            <style jsx>{`
              .overflow-y-auto::-webkit-scrollbar {
                width: 6px;
              }
              .overflow-y-auto::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
              }
              .overflow-y-auto::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 10px;
              }
              .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                background: #a1a1a1;
              }
            `}</style>

            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion: Discussion) => (
                <div
                  key={discussion.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          {discussion.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiCalendar className="text-gray-400" />
                          {discussion.date}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 hover:text-blue-600 transition">
                        {discussion.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {discussion.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaUser className="text-gray-400" />
                          {discussion.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaComments className="text-gray-400" />
                          {discussion.comments} comments
                        </span>
                      </div>
                    </div>
                    <button
                      className="self-center px-3 py-1 text-blue-600 hover:text-white hover:bg-blue-600 rounded-md flex items-center gap-1 border border-blue-100 hover:border-blue-600 transition-colors text-sm"
                      aria-label="View More"
                    >
                      <span>View</span>
                      <FaArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500 mb-3">
                  No discussions found matching your criteria.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Start a new discussion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Discussion Modal */}
      {isModalOpen && (
        <AddDiscussion
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          formData={formData}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Discussions;
