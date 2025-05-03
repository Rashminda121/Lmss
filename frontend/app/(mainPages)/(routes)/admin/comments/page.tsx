"use client";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

type DiscussionComment = {
  _id: string;
  disid: string;
  uid: string;
  uimage: string;
  name: string;
  description: string;
  email: string;
  createdAt: string;
};

type EventComment = {
  _id: string;
  eid: string;
  uid: string;
  uimage: string;
  name: string;
  text: string;
  email: string;
  createdAt: string;
};

interface Event {
  _id: string;
  title: string;
}

interface Discussion {
  _id: string;
  title: string;
}

const AdminComments = () => {
  const [activeTab, setActiveTab] = useState<"discussion" | "event">(
    "discussion"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const [discussionComments, setDiscussionComments] = useState<
    DiscussionComment[]
  >([]);
  const [eventComments, setEventComments] = useState<EventComment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  const hasFetchedData = useRef(false);

  const getData = async () => {
    try {
      const [discussionResponse, eventResponse, disResponse, evResponse] =
        await Promise.all([
          axios.get("http://localhost:4000/api/admin/listDisComments"),
          axios.get("http://localhost:4000/api/admin/listEventComments"),
          axios.get("http://localhost:4000/api/admin/listDiscussions"),
          axios.get("http://localhost:4000/api/admin/listEvents"),
        ]);

      setDiscussionComments(discussionResponse.data);
      setEventComments(eventResponse.data);
      setDiscussions(disResponse.data);
      setEvents(evResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to fetch data",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      getData();
      hasFetchedData.current = true;
    }
  }, []);

  const getParentTitle = (
    comment: DiscussionComment | EventComment
  ): string => {
    if (activeTab === "discussion" && "disid" in comment) {
      const discussion = discussions.find((d) => d._id === comment.disid);
      return discussion?.title || "Unknown Discussion";
    } else if (activeTab === "event" && "eid" in comment) {
      const event = events.find((e) => e._id === comment.eid);
      return event?.title || "Unknown Event";
    }
    return "Unknown";
  };

  const currentDataset =
    activeTab === "discussion" ? discussionComments : eventComments;

  const filteredComments = currentDataset.filter((comment) => {
    const searchLower = searchTerm.toLowerCase();
    const parentTitle = getParentTitle(comment).toLowerCase();

    const nameMatch = comment.name.toLowerCase().includes(searchLower);
    const emailMatch = comment.email.toLowerCase().includes(searchLower);
    const titleMatch = parentTitle.includes(searchLower);
    const contentMatch =
      activeTab === "discussion"
        ? (comment as DiscussionComment).description
            .toLowerCase()
            .includes(searchLower)
        : (comment as EventComment).text.toLowerCase().includes(searchLower);

    return nameMatch || emailMatch || titleMatch || contentMatch;
  });

  // Pagination logic
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  const handleDelete = async (commentId: string, isEventComment: boolean) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const endpoint = isEventComment
          ? "http://localhost:4000/api/admin/deleteEventComment"
          : "http://localhost:4000/api/admin/deleteDisComment";

        await axios.delete(endpoint, { data: { _id: commentId } });

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Comment deleted successfully!",
          showConfirmButton: false,
          timer: 3000,
        });
        getData();
      } catch (error) {
        console.error("Failed to delete comment:", error);
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "Failed to delete comment",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };

  const handleTabChange = (tab: "discussion" | "event") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
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
    <div className="p-6 mt-5 bg-gray-50 min-h-screen">
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
                  setCurrentPage(1);
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === "discussion" ? "Discussion" : "Event"}{" "}
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentComments.length > 0 ? (
                    currentComments.map((comment) => (
                      <tr
                        key={comment._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 min-w-[160px]">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={comment.uimage}
                                alt={comment.name}
                              />
                            </div>
                            <div className="ml-3 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {comment.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-500 min-w-[180px] max-w-[180px]">
                          <div className="truncate">{comment.email}</div>
                        </td>

                        <td className="px-4 py-3 min-w-[150px] max-w-[150px] break-words whitespace-normal">
                          <div className="text-sm font-medium text-gray-900 max-h-16 overflow-y-auto">
                            {getParentTitle(comment)}
                          </div>
                        </td>

                        <td className="px-4 py-3 min-w-[200px] w-[280px]">
                          <div className="text-sm text-gray-900 h-20 overflow-y-auto p-2 rounded border bg-gray-50">
                            {activeTab === "discussion"
                              ? (comment as DiscussionComment).description
                              : (comment as EventComment).text}
                          </div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span>
                              {new Date(comment.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                            <span>
                              {new Date(comment.createdAt).toLocaleTimeString(
                                undefined,
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button
                            onClick={() =>
                              handleDelete(comment._id, activeTab === "event")
                            }
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <FaTrashAlt className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
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
