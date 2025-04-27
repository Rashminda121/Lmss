"use client";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import { useState } from "react";

type Comment = {
  id: number;
  userName: string;
  userEmail: string;
  userImage: string;
  content: string;
  createdAt: string;
};

const AdminComments = () => {
  // Separate datasets for different comment types
  const discussionComments: Comment[] = [
    {
      id: 1,
      userName: "John Doe",
      userEmail: "john@example.com",
      userImage: "https://randomuser.me/api/portraits/men/1.jpg",
      content:
        "This discussion topic is very interesting and relevant to our current needs.",
      createdAt: "2024-04-15 10:30",
    },
    {
      id: 2,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      userImage: "https://randomuser.me/api/portraits/women/1.jpg",
      content: "I completely agree with the points raised in this discussion.",
      createdAt: "2024-04-14 14:45",
    },
    {
      id: 5,
      userName: "Michael Brown",
      userEmail: "michael@example.com",
      userImage: "https://randomuser.me/api/portraits/men/3.jpg",
      content: "This discussion could benefit from more technical details.",
      createdAt: "2024-04-08 11:10",
    },
    {
      id: 6,
      userName: "Emily Davis",
      userEmail: "emily@example.com",
      userImage: "https://randomuser.me/api/portraits/women/3.jpg",
      content: "Has anyone tried implementing this solution in production?",
      createdAt: "2024-04-07 09:20",
    },
    {
      id: 7,
      userName: "Robert Wilson",
      userEmail: "robert@example.com",
      userImage: "https://randomuser.me/api/portraits/men/4.jpg",
      content:
        "We've been using a similar approach for months with great results.",
      createdAt: "2024-04-05 16:45",
    },
    {
      id: 11,
      userName: "Robert Wilson",
      userEmail: "robert@example.com",
      userImage: "https://randomuser.me/api/portraits/men/4.jpg",
      content:
        "We've been using a similar approach for months with great results.",
      createdAt: "2024-04-05 16:45",
    },
  ];

  const eventComments: Comment[] = [
    {
      id: 3,
      userName: "Alex Johnson",
      userEmail: "alex@example.com",
      userImage: "https://randomuser.me/api/portraits/men/2.jpg",
      content: "Looking forward to this event! The speakers seem amazing.",
      createdAt: "2024-04-10 09:15",
    },
    {
      id: 4,
      userName: "Sarah Williams",
      userEmail: "sarah@example.com",
      userImage: "https://randomuser.me/api/portraits/women/2.jpg",
      content: "Will there be recordings available after the event?",
      createdAt: "2024-04-09 16:20",
    },
    {
      id: 8,
      userName: "Jessica Taylor",
      userEmail: "jessica@example.com",
      userImage: "https://randomuser.me/api/portraits/women/4.jpg",
      content: "What time does the event start in Pacific Time?",
      createdAt: "2024-04-04 12:30",
    },
    {
      id: 9,
      userName: "Daniel Anderson",
      userEmail: "daniel@example.com",
      userImage: "https://randomuser.me/api/portraits/men/5.jpg",
      content: "Will there be networking opportunities after the main event?",
      createdAt: "2024-04-03 08:15",
    },
    {
      id: 10,
      userName: "Olivia Martinez",
      userEmail: "olivia@example.com",
      userImage: "https://randomuser.me/api/portraits/women/5.jpg",
      content: "Is there a dress code for this event?",
      createdAt: "2024-04-02 14:50",
    },
    {
      id: 12,
      userName: "Olivia Martinez",
      userEmail: "olivia@example.com",
      userImage: "https://randomuser.me/api/portraits/women/5.jpg",
      content: "Is there a dress code for this event?",
      createdAt: "2024-04-02 14:50",
    },
  ];

  const [activeTab, setActiveTab] = useState<"discussion" | "event">(
    "discussion"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  // Get current dataset based on active tab
  const currentDataset =
    activeTab === "discussion" ? discussionComments : eventComments;

  // Filter comments by search term
  const filteredComments = currentDataset.filter((comment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      comment.userName.toLowerCase().includes(searchLower) ||
      comment.userEmail.toLowerCase().includes(searchLower) ||
      comment.content.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  const handleEdit = (commentId: number) => {
    console.log("Edit comment:", commentId);
    // Add your edit logic here
  };

  const handleDelete = (commentId: number) => {
    console.log("Delete comment:", commentId);
    // Add your delete logic here
  };

  const handleTabChange = (tab: "discussion" | "event") => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
    setSearchTerm(""); // Optional: Clear search when changing tabs
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
              Comments Management
            </h2>
            <p className="text-gray-600 mt-2">Manage all user comments</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab} comments...`}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange("discussion")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "discussion"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Discussion Comments ({discussionComments.length})
            </button>
            <button
              onClick={() => handleTabChange("event")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "event"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Event Comments ({eventComments.length})
            </button>
          </nav>
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
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Comment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
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
                  {currentComments.length > 0 ? (
                    currentComments.map((comment) => (
                      <tr
                        key={comment.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={comment.userImage}
                                alt={comment.userName}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {comment.userName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {comment.userEmail}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {comment.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {comment.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEdit(comment.id)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(comment.id)}
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
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {searchTerm
                          ? `No ${activeTab} comments match your search`
                          : `No ${activeTab} comments found`}
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
                disabled={currentPage === totalPages || totalPages === 0}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages || totalPages === 0
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
                    {filteredComments.length > 0 ? indexOfFirstComment + 1 : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastComment, filteredComments.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredComments.length}</span>{" "}
                  results
                </p>
              </div>
              {totalPages > 0 && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComments;
