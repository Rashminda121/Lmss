"use client";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaComments, FaPlus, FaUser } from "react-icons/fa";
import { FiArrowUpRight, FiCalendar, FiChevronRight } from "react-icons/fi";
import Swal from "sweetalert2";
import AddDiscussion from "./components/AddDiscussion";
import { useRouter } from "next/navigation";

interface Discussion {
  _id: string;
  uid: string;
  name: string;
  title: string;
  description: string;
  comments: string;
  category: string;
  createdAt: string;
}

const Discussions = () => {
  const [view, setView] = useState<"all" | "mine">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [data, setData] = useState<Discussion[]>([]);

  const router = useRouter();

  const { user } = useUser();
  const hasFetchedData = useRef(false);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/user/listDiscussions"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      getData();
      hasFetchedData.current = true;
    }

    // Reset form when modal closes
    if (!isModalOpen) {
      setFormData({
        title: "",
        description: "",
        category: "general",
        email: user?.emailAddresses[0]?.emailAddress || "",
      });
    }
  }, [isModalOpen, user]);

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
    "Ideas",
    "Careers",
    "Productivity",
    "Tools",
    "Projects",
    "Support",
  ];

  const userName = user?.fullName || "Unknown User";

  const filteredDiscussions = data.filter(
    (d: Discussion) =>
      (view === "all" || d.name === userName) &&
      (categoryFilter === "All" ||
        d.category.charAt(0).toUpperCase() + d.category.slice(1) ===
          categoryFilter)
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
      getData();
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
    <div className="min-h-screen pt-5 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
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
                  key={discussion._id}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-400"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
                          {discussion.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiCalendar className="text-gray-400" />
                          {
                            new Date(discussion.createdAt)
                              .toISOString()
                              .split("T")[0]
                          }
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-300 cursor-pointer">
                        {discussion.title}
                      </h2>
                      <p className="first-letter:uppercase text-sm text-gray-600 mb-4 line-clamp-2">
                        {discussion.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FaUser className="text-gray-400" />
                          <span className="text-gray-700 font-medium">
                            {discussion.name}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaComments className="text-gray-400" />
                          <span className="text-gray-700 font-medium">
                            {discussion.comments}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="relative self-center">
                      <button
                        onClick={() =>
                          router.push(
                            `./discussions/viewDiscussion/${discussion._id}`
                          )
                        }
                        className="self-center flex items-center gap-1 px-4 py-2 bg-white text-blue-600 rounded-full border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-500 group hover:-translate-y-1 hover:rotate-1"
                      >
                        <span className="text-sm font-medium transition-all duration-500 group-hover:translate-x-1">
                          Details
                        </span>
                        <div className="relative w-4 h-4">
                          <FiArrowUpRight className="absolute inset-0 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2 transition-all duration-500" />
                          <FiChevronRight className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" />
                        </div>
                      </button>
                    </div>
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
          isUpdating={false}
          isAdding={true}
        />
      )}
    </div>
  );
};

export default Discussions;
