"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { FiEdit2 } from "react-icons/fi";
import AddDiscussion from "../../components/AddDiscussion";

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

export default function ViewDiscussion({ params }: ViewDiscussionProps) {
  const { id } = params;
  const [data, setData] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const hasFetchedData = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    _id: id,
    title: "",
    description: "",
    category: "general",
    email: user?.emailAddresses[0]?.emailAddress || "",
  });

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

  useEffect(() => {
    if (!hasFetchedData.current) {
      getData();
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

  const handleupdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form Data:", formData);

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
      console.error("Failed to submit discussion:", error);

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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Main Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {/* Title with Edit Button */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white pr-4 capitalize">
              {data.title || "Untitled Discussion"}
            </h1>
            <span className="px-3 py-1 mb-1 md:mb-0 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full capitalize whitespace-nowrap">
              {data.category}
            </span>
          </div>
          {isAuthor && (
            <div className="relative inline-block group">
              <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="
          flex items-center justify-center
          w-10 h-10 rounded-xl
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          text-gray-600 dark:text-gray-400
          hover:text-blue-600 dark:hover:text-blue-400
          shadow-sm hover:shadow-md
          transition-all duration-300
          hover:-translate-y-0.5
          active:translate-y-0
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
        "
              >
                <FiEdit2 size={18} />
              </button>
              <div
                className="
          absolute -top-9 left-1/2 -translate-x-1/2
          px-2 py-1 text-xs font-medium
          bg-gray-800 text-white rounded
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          pointer-events-none
          whitespace-nowrap
          before:absolute before:top-full before:left-1/2 
          before:-translate-x-1/2 before:border-4 
          before:border-transparent before:border-t-gray-800
        "
              >
                Edit Post
              </div>
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Comments Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Comments
          </h2>
        </div>

        {/* Comment Form */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <textarea
            className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            rows={3}
            placeholder="Share your thoughts..."
          />
          <div className="flex justify-end mt-3">
            <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Post Comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="max-h-[400px] overflow-y-auto">
          <div className="p-6">
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
}
