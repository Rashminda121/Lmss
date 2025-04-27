"use client";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaSearch,
  FaComments,
} from "react-icons/fa";
import { useState } from "react";

const AdminDiscussions = () => {
  const allDiscussions = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      title: "How to optimize React performance?",
      description:
        "Looking for best practices to optimize large React applications...",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      category: "React",
      role: "User",
      comment_count: 24,
      createdAt: "2024-04-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      title: "State management in 2024",
      description:
        "What's the best state management solution for complex apps...",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      category: "Frontend",
      role: "Moderator",
      comment_count: 42,
      createdAt: "2024-04-10",
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "alex@example.com",
      title: "Database design patterns",
      description:
        "Discussing scalable database architectures for microservices...",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      category: "Backend",
      role: "Admin",
      comment_count: 15,
      createdAt: "2024-04-05",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah@example.com",
      title: "CSS frameworks comparison",
      description: "Tailwind vs Bootstrap vs CSS modules - which to choose...",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      category: "CSS",
      role: "User",
      comment_count: 31,
      createdAt: "2024-03-28",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com",
      title: "Authentication best practices",
      description: "Implementing secure auth with JWT and refresh tokens...",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      category: "Security",
      role: "User",
      comment_count: 8,
      createdAt: "2024-03-20",
    },
    {
      id: 6,
      name: "Emily Davis",
      email: "emily@example.com",
      title: "Serverless architecture pros/cons",
      description: "When does serverless make sense for production apps...",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      category: "Cloud",
      role: "User",
      comment_count: 19,
      createdAt: "2024-03-15",
    },
    {
      id: 7,
      name: "David Wilson",
      email: "david@example.com",
      title: "TypeScript migration guide",
      description:
        "Step-by-step guide for migrating from JavaScript to TypeScript...",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      category: "TypeScript",
      role: "Moderator",
      comment_count: 27,
      createdAt: "2024-03-10",
    },
    {
      id: 8,
      name: "Jessica Taylor",
      email: "jessica@example.com",
      title: "Docker for development",
      description:
        "Setting up efficient Docker workflows for local development...",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      category: "DevOps",
      role: "User",
      comment_count: 12,
      createdAt: "2024-03-05",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const discussionsPerPage = 5;

  // Filter discussions based on search term
  const filteredDiscussions = allDiscussions.filter((discussion) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      discussion.name.toLowerCase().includes(searchLower) ||
      discussion.email.toLowerCase().includes(searchLower) ||
      discussion.title.toLowerCase().includes(searchLower) ||
      discussion.description.toLowerCase().includes(searchLower) ||
      discussion.category.toLowerCase().includes(searchLower)
    );
  });

  // Get current discussions for pagination
  const indexOfLastDiscussion = currentPage * discussionsPerPage;
  const indexOfFirstDiscussion = indexOfLastDiscussion - discussionsPerPage;
  const currentDiscussions = filteredDiscussions.slice(
    indexOfFirstDiscussion,
    indexOfLastDiscussion
  );
  const totalPages = Math.ceil(filteredDiscussions.length / discussionsPerPage);

  const handleEdit = (discussionId: number) => {
    console.log("Edit discussion:", discussionId);
    // Add your edit logic here
  };

  const handleDelete = (discussionId: number) => {
    console.log("Delete discussion:", discussionId);
    // Add your delete logic here
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Discussion Management
            </h2>
            <p className="text-gray-600 mt-2">Manage all forum discussions</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
              <FaPlus className="mr-2" />
              Add Discussion
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Discussion
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Comments
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDiscussions.length > 0 ? (
                    currentDiscussions.map((discussion) => (
                      <tr
                        key={discussion.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={discussion.image}
                                alt={discussion.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {discussion.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {discussion.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 gap-2">
                          <div className="text-sm font-medium text-gray-900">
                            {discussion.title}
                          </div>
                          <textarea
                            className="text-sm text-gray-500"
                            value={discussion.description}
                            style={{ width: "100%", resize: "vertical" }}
                            readOnly
                          />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {discussion.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              discussion.role === "Admin"
                                ? "bg-purple-100 text-purple-800"
                                : discussion.role === "Moderator"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {discussion.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaComments className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {discussion.comment_count}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {discussion.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEdit(discussion.id)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(discussion.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
                            >
                              <FaTrashAlt className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No discussions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {indexOfFirstDiscussion + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      indexOfLastDiscussion,
                      filteredDiscussions.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredDiscussions.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                      currentPage === 1
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                      currentPage === totalPages
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscussions;
