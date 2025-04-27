"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Swal from "sweetalert2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface ViewEventProps {
  params: {
    id: string;
  };
}

interface Event {
  _id: string;
  uid: string;
  title: string;
  date: Date;
  time: String;
  location: string;
  coordinates: object;
  description: string;
  category: string;
  type: string;
  url: string;
  image: string;
}

interface Comment {
  _id: string;
  eid: string;
  uid: string;
  uimage: string;
  name: string;
  text: string;
  email: string;
  createdAt: Date;
}

const categories = [
  "All",
  "Conference",
  "Expo",
  "Hackathon",
  "Education",
  "Technology",
  "General",
  "Workshop",
  "Other",
];

const types = ["All", "Online", "In-person", "Hybrid"];

export default function ViewEvent({ params }: ViewEventProps) {
  const { id } = params;
  const [data, setData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const { user } = useUser();
  const hasFetchedData = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const [newComment, setNewComment] = useState({
    eid: id,
    uid: user?.id,
    uimage: user?.imageUrl,
    name: user?.fullName,
    text: "",
    email: user?.primaryEmailAddress?.emailAddress,
  });
  const [updatedText, setUpdatedText] = useState({
    _id: "",
    description: "",
  });
  // const [showShareOptions, setShowShareOptions] = useState(false);

  const [formData, setFormData] = useState({
    _id: id,
    title: "",
    date: "",
    time: "",
    location: "",
    coordinates: {},
    description: "",
    category: "",
    type: "",
    url: "",
    image: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
        await axios.delete(`http://localhost:4000/user/deleteEvent`, {
          data: { id },
        });

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Event deleted successfully!",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      window.location.href = "/events";
    } catch (error: any) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: error.response?.data?.message || "Failed to delete event",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/viewEvent",
        { id }
      );
      setData(response.data);
      setFormData((prev) => ({
        ...prev,
        title: response.data.title,
        date: response.data.date,
        time: response.data.time,
        location: response.data.location,
        coordinates: response.data.coordinates,
        description: response.data.description,
        category: response.data.category,
        type: response.data.type,
        url: response.data.url,
        image: response.data.image,
      }));
      setImagePreview(response.data.image);

      console.log(response.data);
      //await fetchComments();
    } catch (error: any) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Error fetching event. Please try again.",
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
      setError(error.response?.data?.message || "Error fetching event");
    } finally {
      setIsLoading(false);
    }
  };

  const getCommentData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/viewEventComments",
        { eid: id }
      );
      setComments(response.data);
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
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isAuthor = user?.id === data?.uid;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "User not authenticated. Please log in.",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Validate required fields
    if (
      !formData.title ||
      !formData.date ||
      !formData.location ||
      !formData.description ||
      !formData.category ||
      !formData.type
    ) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Please fill all required fields",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:4000/user/updateEvent",
        formData
      );

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Event updated successfully!",
        showConfirmButton: false,
        timer: 3000,
      });

      setIsModalOpen(false);
      getData();
    } catch (error: any) {
      console.error("Failed to update event:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to update event. Please try again.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleInputComment = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsCommentLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/user/addEventComment",
        {
          eid: id,
          uid: user?.id,
          text: newComment.text,
          uimage: user?.imageUrl,
          name: user?.fullName,
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

      clearComment();
      setTimeout(() => {
        setComments([]);
        getCommentData();
      }, 500);
    } catch (error) {
      console.error("Failed to post comment:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to post comment. Please try again.",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsCommentLoading(false);
    }
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
          "http://localhost:4000/user/deleteEventComment",
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
          setComments([]);
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
      const response = await axios.put(
        "http://localhost:4000/user/editEventComment",
        {
          _id: updatedText._id,
          text: updatedText.description,
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

      handleCommentCancel();
      getCommentData();
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

  const handleCommentCancel = () => {
    setIsCommentModalOpen(false);
    setUpdatedText({ _id: "", description: "" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: "top",
      icon: "success",
      title: "Link copied to clipboard!",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const generateGoogleCalendarLink = () => {
    if (!data) return "";
    const eventDate = new Date(data.date);
    const formattedDate = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // Add 1 hour
    const formattedEndDate = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      data.title
    )}&dates=${formattedDate}/${formattedEndDate}&details=${encodeURIComponent(
      data.description
    )}&location=${encodeURIComponent(data.location)}&sf=true&output=xml`;
  };

  const generateICalendarLink = () => {
    if (!data) return "";
    const eventDate = new Date(data.date);
    const formattedDate = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

    return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${formattedDate}
DTEND:${formattedDate}
SUMMARY:${data.title}
DESCRIPTION:${data.description}
LOCATION:${data.location}
END:VEVENT
END:VCALENDAR`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error}</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Event not found
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  });

  const formatTo12Hour = (time24: any) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 to 12
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  const formatCommentDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearComment = () => {
    setNewComment({
      eid: id,
      uid: user?.id,
      uimage: user?.imageUrl,
      name: user?.fullName,
      text: "",
      email: user?.primaryEmailAddress?.emailAddress,
    });
  };

  return (
    <>
      <Head>
        <title>{data.title} | Event Details</title>
        <meta name="description" content={data.description.substring(0, 160)} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75"></div>
          <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 text-white w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 rounded-full text-xs sm:text-sm font-semibold mb-2">
                  {data.category}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 line-clamp-2">
                  {data.title}
                </h1>
                <p className="text-sm sm:text-base md:text-xl">
                  {formattedDate}{" "}
                  {data.time && `at ${formatTo12Hour(data.time)}`}
                </p>
              </div>
              {isAuthor && (
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-white text-gray-800 rounded hover:bg-gray-200 transition flex items-center text-sm sm:text-base"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center text-sm sm:text-base"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Left Column */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  About This Event
                </h2>
                <div className="max-h-40 sm:max-h-60 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {data.description}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Location
                </h2>
                <div className="flex items-start mb-3 sm:mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">
                      {data.location}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {data.type} Event
                    </p>
                  </div>
                </div>
                {/* Map placeholder */}
                {/* <div className="h-48 sm:h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm sm:text-base">
                    Map of {data.location}
                  </p>
                </div> */}
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-base md:text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Comments ({comments.length})
                </h2>

                {user ? (
                  <form onSubmit={handleCommentSubmit} className="mb-6">
                    <div className="flex items-start gap-3">
                      <img
                        src={user.imageUrl}
                        alt={user.fullName || "User"}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <textarea
                          rows={3}
                          name="text"
                          value={newComment.text || ""}
                          onChange={handleInputComment}
                          placeholder="Add a comment..."
                          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          disabled={isCommentLoading}
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={!newComment.text || isCommentLoading}
                            className="px-4 py-2 text-xs md:text-sm font-medium border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCommentLoading ? "Posting..." : "Post Comment"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600 mb-3">
                      Please sign in to leave a comment
                    </p>
                    <Link
                      href="/sign-in"
                      className="px-4 py-2 text-sm font-medium border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 inline-block"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                  {comments.length === 0 ? (
                    <div className="text-sm text-center py-6 text-gray-500">
                      No comments yet. Be the first to comment!
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={comment.uimage}
                            alt={comment.name}
                            className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-xs md:text-sm sm:text-base">
                                  {comment.name}
                                </h4>
                                <p className="text-gray-500 text-xs">
                                  {formatCommentDate(comment.createdAt)}
                                </p>
                              </div>
                              {(user?.id === comment.uid || isAuthor) && (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => {
                                      setIsCommentModalOpen(true);
                                      setUpdatedText({
                                        _id: comment._id,
                                        description: comment.text,
                                      });
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-white hover:bg-blue-500 transition-colors rounded-full"
                                    title="Edit comment"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCommentDelete(comment._id)
                                    }
                                    className="p-1.5 text-gray-500 hover:text-white hover:bg-red-500 transition-colors rounded-full"
                                    title="Delete comment"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="mt-1 text-gray-700 text-xs md:text-sm">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={commentsEndRef} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {`Date${data.time ? " & Time" : ""}`}
                  </h3>
                  <div className="flex items-center p-2 text-gray-700 text-sm md:text-base border border-gray-400 rounded">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>
                      {formattedDate}{" "}
                      {data.time && `at ${formatTo12Hour(data.time)}`}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Calendar
                      value={new Date(data.date)}
                      className="border p-2 rounded-lg w-full"
                      tileClassName={({ date }) => {
                        const eventDate = new Date(data.date);
                        return date.getDate() === eventDate.getDate() &&
                          date.getMonth() === eventDate.getMonth() &&
                          date.getFullYear() === eventDate.getFullYear()
                          ? "bg-blue-500 text-white rounded-full"
                          : "";
                      }}
                    />
                  </div>
                </div>

                <div className="mb-5 sm:mb-7">
                  <h3 className="text-sm font-medium text-gray-800 tracking-wider  mb-2">
                    Event Type
                  </h3>
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <p className="text-gray-800 font-medium">{data.type}</p>
                  </div>
                </div>

                <hr className="my-4 border-gray-200" />

                <div className="space-y-3">
                  <a
                    href={generateICalendarLink()}
                    download={`${data.title}.ics`}
                    className="block w-full bg-white hover:bg-gray-50 text-gray-700 text-center font-semibold py-2 sm:py-3 px-4 rounded-lg border border-gray-300 transition duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Download iCal
                  </a>

                  <a
                    href={generateGoogleCalendarLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center gap-4 w-full max-w-md p-4 rounded-2xl border border-gray-300 bg-white shadow-sm hover:shadow-md transition duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:bg-blue-200 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                          Add to Google Calendar
                        </p>
                      </div>
                    </div>
                  </a>
                  {data.url && (
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-200 text-sm sm:text-base"
                    >
                      More Details
                    </a>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => {
                        // setShowShareOptions(!showShareOptions);
                        copyToClipboard(window.location.href);
                      }}
                      className="w-full flex items-center justify-center text-blue-500 hover:text-blue-700 font-semibold py-2 px-4 rounded-lg border border-blue-500 hover:border-blue-700 transition duration-200 text-sm sm:text-base"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      Share Event
                    </button>

                    {/* {showShareOptions && (
                      <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        <div
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            copyToClipboard(window.location.href);
                            setShowShareOptions(false);
                          }}
                        >
                          Copy Event Link
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>

                {data.url && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Event URL
                    </h4>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={data.url}
                        readOnly
                        className="flex-1 text-xs p-2 border border-gray-300 rounded-l-lg focus:outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(data.url)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-lg text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50 shrink-0">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Event
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter event title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={
                        formData.date
                          ? new Date(formData.date).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      name="time"
                      type="time"
                      value={formData.time || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.5rem]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter location link"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.5rem]"
                    >
                      <option value="">Select type</option>
                      {types
                        .filter((t) => t !== "All")
                        .map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category ? formData.category : ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.5rem]"
                    >
                      <option value="">Select category</option>
                      {categories
                        .filter((c) => c !== "All")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Describe your event..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div
                      onClick={triggerFileInput}
                      className="flex-shrink-0 h-24 w-24 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-contain rounded-lg"
                        />
                      ) : (
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="w-full text-sm bg-white py-2 px-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {imagePreview ? "Change Image" : "Choose Image"}
                      </button>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event URL (optional)
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter event or virtual meeting link"
                  />
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Update Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
    </>
  );
}
