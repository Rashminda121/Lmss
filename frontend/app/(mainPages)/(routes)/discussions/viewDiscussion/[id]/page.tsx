"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import AddDiscussion from "../../components/AddDiscussion";
import { useRouter } from "next/navigation";

interface ViewDiscussionProps {
  params: {
    id: string;
  };
}

interface Discussion {
  _id: string;
  uid: string;
  email: string;
  uimage: string;
  name: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
interface CommentInterface {
  _id: string;
  disid: string;
  uid: string;
  uimage: string;
  name: string;
  description: string;
  email: string;
  createdAt: string;
}

export default function ViewDiscussion({ params }: ViewDiscussionProps) {
  const { id } = params;
  const [data, setData] = useState<Discussion | null>(null);
  const [commentData, setCommentData] = useState<CommentInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const hasFetchedData = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const [updatedText, setUpdatedText] = useState({
    _id: "",
    description: "",
  });
  const [formData, setFormData] = useState({
    _id: id,
    title: "",
    description: "",
    category: "general",
    email: user?.emailAddresses[0]?.emailAddress || "",
  });

  const [comment, setComment] = useState({
    disid: id,
    uid: user?.id,
    uimage: user?.imageUrl,
    name: user?.fullName,
    description: "",
    email: user?.primaryEmailAddress?.emailAddress,
  });

  const router = useRouter();

  const getData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/viewDiscussion",
        { id }
      );
      setData(response.data);
      setFormData((prev) => ({
        ...prev,
        title: response.data.title,
        description: response.data.description,
        category: response.data.category,
        email:
          response.data.email ||
          user?.emailAddresses[0]?.emailAddress ||
          prev.email,
      }));
    } catch (error: any) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Error fetching discussion. Please try again.",
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
    } finally {
      setLoading(false);
    }
  };

  const getCommentData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/viewComments",
        { disid: id }
      );
      setCommentData(response.data);
    } catch (error: any) {
      console.log("No comments available");
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      getData();
      getCommentData();
      hasFetchedData.current = true;
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Discussion not found or failed to load.
          </p>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === data.uid;

  const isCommenter = (cid: string) => {
    return user?.id === cid;
  };

  const handleupdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/user/updateDiscussion",
        {
          _id: formData._id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          email: formData.email,
        }
      );

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Discussion updated successfully!",
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
      console.error("Failed to update discussion:", error);

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to update discussion. Please try again.",
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
      _id: id,
      title: data?.title || "",
      description: data?.description || "",
      category: data?.category || "general",
      email: user?.emailAddresses[0]?.emailAddress || "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const categories: string[] = [
    "All",
    "General",
    "Courses",
    "Resources",
    "Help",
    "Ideas",
  ];

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          "http://localhost:4000/user/deleteDiscussion",
          {
            data: { id },
          }
        );

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Discussion deleted successfully!",
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
        router.push("/discussions");
      }
    } catch (error: any) {
      console.error("Failed to delete discussion:", error);

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to delete discussion. Please try again.",
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

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/user/addComment",
        {
          disid: id,
          uid: user?.id,
          uimage: user?.imageUrl,
          name: user?.fullName,
          description: comment.description,
          email: user?.primaryEmailAddress?.emailAddress,
        }
      );

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Comment added successfully!",
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

      getCommentData();
      clearCommentForm();
    } catch (error: any) {
      console.error("Failed to update discussion:", error);

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to add comment. Please try again.",
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

  const handleInputCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputupdateCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "commentdescription") {
      setUpdatedText((prev) => ({
        ...prev,
        description: value,
      }));
    } else {
      setUpdatedText((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCommentUpdate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/editComment",
        {
          _id: updatedText._id,
          description: updatedText.description,
        }
      );

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Comment updated successfully!",
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

      getCommentData();
      handleCommentCancel();
    } catch (error: any) {
      console.error("Failed to update discussion:", error);

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to update comment. Please try again.",
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

  const clearCommentForm = () => {
    setComment({
      disid: id,
      uid: user?.id,
      uimage: user?.imageUrl,
      name: user?.fullName,
      description: "",
      email: user?.primaryEmailAddress?.emailAddress,
    });
  };

  const handleCommentCancel = () => {
    setIsCommentModalOpen(false);
    setUpdatedText({ _id: "", description: "" });
  };

  const handleCommentDelete = async (cid: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          "http://localhost:4000/user/deleteComment",
          {
            data: { _id: cid },
          }
        );

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Comment deleted successfully!",
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

        setTimeout(() => {
          setCommentData([]);
          getCommentData();
        }, 500);
      }
    } catch (error: any) {
      console.error("Failed to delete discussion:", error);

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to delete discussion. Please try again.",
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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Main Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {/* Title with Edit Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white pr-2 sm:pr-4 capitalize break-words max-w-full">
              {data.title || "Untitled Discussion"}
            </h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full capitalize whitespace-nowrap">
              {data.category}
            </span>
          </div>

          {isAuthor && (
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="
          w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center
          rounded-md border border-gray-300 dark:border-gray-600
          transition-all duration-200
          hover:shadow-sm hover:scale-105 
          hover:bg-blue-600 hover:text-white hover:border-blue-600
          dark:hover:bg-blue-700 dark:hover:border-blue-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        "
                aria-label="Edit"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete()}
                type="button"
                className="
          w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center
          rounded-md border border-gray-300 dark:border-gray-600
          transition-all duration-200
          hover:shadow-sm hover:scale-105 
          hover:bg-red-600 hover:text-white hover:border-red-600
          dark:hover:bg-red-700 dark:hover:border-red-700
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        "
                aria-label="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            {data.uimage && (
              <img
                src={data.uimage}
                alt={data.name}
                width={28}
                height={28}
                className="rounded-full object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
              />
            )}
            <span className="font-medium text-gray-700 dark:text-gray-200 capitalize text-sm sm:text-xs truncate">
              {data.name || "Anonymous"}
            </span>
          </div>

          {data.updatedAt &&
          new Date(data.updatedAt).getTime() !==
            new Date(data.createdAt).getTime() ? (
            <div className="flex items-center mt-1 md:mt-0 gap-1 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              <span className="hidden xs:inline text-gray-400 dark:text-gray-500">
                ·
              </span>
              <span className="text-[0.7rem] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-1.5 py-0.5 rounded leading-none whitespace-nowrap">
                Updated
              </span>
              <time dateTime={data.updatedAt} className="whitespace-nowrap">
                {new Date(data.updatedAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          ) : (
            <div className="flex items-center mt-1 md:mt-0 gap-1 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              <span className="hidden xs:inline text-gray-400 dark:text-gray-500">
                ·
              </span>
              <time dateTime={data.createdAt} className="whitespace-nowrap">
                {new Date(data.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <div className="max-h-[300px] overflow-y-auto pr-2">
            <p className="first-letter:uppercase whitespace-pre-line leading-relaxed">
              {data.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700/80 overflow-hidden transition-all duration-200">
        {/* Comments Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              Comments
              <span className="text-sm font-medium bg-blue-100 text-gray-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full ml-2">
                {commentData?.length || 0}
              </span>
            </h2>
          </div>
        </div>

        {/* Comment Form */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-700/30">
          <form onSubmit={handleCommentSubmit}>
            <textarea
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-200 resize-none"
              name="description"
              rows={3}
              onChange={handleInputCommentChange}
              value={comment.description || ""}
              placeholder="Share your thoughts..."
            />
            <div className="flex justify-end mt-3 space-x-2">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Post Comment
              </button>
            </div>
          </form>
        </div>

        <div
          className={`divide-y divide-gray-100 dark:divide-gray-700/60 ${
            commentData?.length > 3 ? "max-h-[300px] overflow-y-auto" : ""
          }`}
        >
          {commentData && commentData.length > 0 ? (
            commentData.map((cdata: CommentInterface) => (
              <div
                key={cdata._id}
                className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-150 group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={cdata.uimage}
                    alt={cdata.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                          {cdata.name}
                        </h4>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(cdata.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {cdata.uid && isCommenter(cdata.uid) && (
                        <div className="flex items-center gap-2 transition-opacity">
                          <button
                            onClick={() => {
                              setIsCommentModalOpen(true);
                              setUpdatedText({
                                _id: cdata._id,
                                description: cdata.description,
                              });
                            }}
                            className="text-gray-900 hover:text-white dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-600 dark:hover:bg-gray-600/30"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCommentDelete(cdata._id)}
                            className="text-gray-900 hover:text-white dark:hover:text-red-400 p-1 rounded-full hover:bg-red-600 dark:hover:bg-gray-600/30"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line max-h-32 overflow-y-auto pr-1">
                      {cdata.description}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        Like
                      </button>
                      <button className="text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6">
              <div className="text-center py-8 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic max-w-xs">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            </div>
          )}
        </div>

        {commentData?.length > 3 && (
          <div className="sticky bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-700/80 pointer-events-none flex justify-center items-start pt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-gray-400 animate-bounce"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {isModalOpen && (
          <AddDiscussion
            setIsModalOpen={setIsModalOpen}
            handleSubmit={handleupdateSubmit}
            handleInputChange={handleInputChange}
            formData={formData}
            isUpdating={true}
            isAdding={false}
          />
        )}

        {isCommentModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl transition-all duration-200 ease-out">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Comment
                </h3>
                <button
                  onClick={handleCommentCancel}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <textarea
                name="commentdescription"
                value={updatedText.description || ""}
                onChange={handleInputupdateCommentChange}
                rows={3}
                className="w-full px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Share your thoughts..."
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCommentCancel}
                  className="px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommentUpdate}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                  disabled={!updatedText.description.trim()}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
