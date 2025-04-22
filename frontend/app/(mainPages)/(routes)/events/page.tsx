"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import Swal from "sweetalert2";
import axios from "axios";

const allEvents = [
  {
    id: 1,
    uid: 1,
    title: "Tech Conference 2025",
    date: "2025-04-25",
    location: "Colombo, Sri Lanka",
    description: "Advancements in AI, Cloud, and DevOps strategies.",
    category: "Conference",
    type: "On-site",
    image: "https://source.unsplash.com/featured/?conference,technology",
  },
  {
    id: 2,
    uid: 2,
    title: "Startup Innovation Expo",
    date: "2025-05-10",
    location: "NSBM Auditorium",
    description: "Showcase innovations and engage with investors.",
    category: "Expo",
    type: "On-site",
    image: "https://source.unsplash.com/featured/?startup,business",
  },
  {
    id: 3,
    uid: 3,
    title: "Global Hackathon 2025",
    date: "2025-06-02",
    location: "Virtual",
    description: "24-hour global hackathon to solve real-world challenges.",
    category: "Hackathon",
    type: "Online",
    image: "https://source.unsplash.com/featured/?coding,hackathon",
  },
  {
    id: 4,
    uid: 4,
    title: "Campus Meetup",
    date: "2025-07-15",
    location: "University Grounds",
    description: "Networking for students and faculty.",
    category: "General",
    type: "On-site",
    image: "https://source.unsplash.com/featured/?community,event",
  },
  {
    id: 5,
    uid: 5,
    title: "AI Workshop Series",
    date: "2025-05-18",
    location: "Colombo Innovation Tower",
    description: "Hands-on workshops on machine learning and neural networks.",
    category: "Workshop",
    type: "On-site",
    image: "https://source.unsplash.com/featured/?ai,workshop",
  },
  {
    id: 6,
    uid: 6,
    title: "Digital Marketing Summit",
    date: "2025-06-22",
    location: "Virtual",
    description: "Learn the latest trends in digital marketing strategies.",
    category: "Conference",
    type: "Online",
    image: "https://source.unsplash.com/featured/?marketing,digital",
  },
];

const categories = [
  "All",
  "Conference",
  "Expo",
  "Hackathon",
  "General",
  "Workshop",
  "Other",
];

const months = [
  "All",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const types = ["All", "Online", "On-site", "Hybrid"];

const getMonthFromDate = (dateStr: string): string => {
  const monthIndex = new Date(dateStr).getMonth();
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][monthIndex];
};

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();

  const [formData, setFormData] = useState({
    uid: user?.id || "",
    title: "",
    date: "",
    location: "",
    coordinates: "",
    description: "",
    category: "",
    type: "",
    url: "",
    image: "",
  });

  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        uid: user?.id || "",
        title: "",
        date: "",
        location: "",
        coordinates: "",
        description: "",
        category: "",
        type: "",
        url: "",
        image: "",
      });
      setImagePreview(null);
    }
    console.log(user?.id);
  }, [isModalOpen, user]);

  const filteredEvents = allEvents.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    const matchesMonth =
      selectedMonth === "All" || getMonthFromDate(event.date) === selectedMonth;
    const matchesType = selectedType === "All" || event.type === selectedType;
    const matchesDate = !selectedDate || event.date === selectedDate;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesCategory &&
      matchesMonth &&
      matchesType &&
      matchesDate &&
      matchesSearch
    );
  });

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedMonth("All");
    setSelectedType("All");
    setSelectedDate("");
    setSearchQuery("");
  };

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
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match("image.*")) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "Please select an image file",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "Image size should be less than 5MB",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({
          ...prev,
          image: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
      !formData.category ||
      !formData.type ||
      !formData.description
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
      const dataToSubmit = {
        ...formData,
        uid: user?.id,
      };

      const response = await axios.post(
        "http://localhost:4000/user/addEvent",
        dataToSubmit
      );

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Event added successfully!",
        showConfirmButton: false,
        timer: 3000,
      });

      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to submit event:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to submit event. Please try again.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Upcoming Events
        </h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-0 focus:ring-0 pl-10 pr-4 py-3 text-sm md:text-base text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 active:scale-95"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="font-medium text-xs md:text-sm hidden md:block">
                Add Event
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Filters
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full rounded-lg px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full rounded-lg px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specific Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-lg px-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Event Cards */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {filteredEvents.length} Events Found
              </h2>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-screen pb-20">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-48">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="text-lg font-bold text-gray-900 flex-1 min-w-0">
                          {event.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                            event.type === "Online"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {event.type === "On-site" ? "On-Site" : event.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
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
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No events found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50 shrink-0">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create New Event
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
                      value={formData.title || ""}
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
                        value={formData.date || Date.now()}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="type"
                        value={formData.type || "Select type"}
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter location link"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category || "Select category"}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      name="description"
                      value={formData.description || ""}
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
                      ref={fileInputRef || ""}
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
                            src={imagePreview || ""}
                            alt="Preview"
                            className="h-full w-full object-cover rounded-lg"
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
                      value={formData.url || ""}
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
                      Create Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
