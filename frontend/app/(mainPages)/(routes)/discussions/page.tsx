"use client";
import React, { useState } from "react";
import { FaArrowRight, FaPlus } from "react-icons/fa";

const mockDiscussions = [
  {
    id: 1,
    title: "How to integrate Firebase with Next.js?",
    author: "Jane Doe",
    date: "April 15, 2025",
    comments: 5,
    category: "Next.js",
  },
  {
    id: 2,
    title: "Best practices for responsive UI design",
    author: "John Smith",
    date: "April 17, 2025",
    comments: 2,
    category: "UI/UX",
  },
  {
    id: 3,
    title: "Deploying React apps on Vercel",
    author: "Alice Johnson",
    date: "April 19, 2025",
    comments: 8,
    category: "Deployment",
  },
];

const Discussions = () => {
  const [view, setView] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", "Next.js", "UI/UX", "Deployment"];

  const filteredDiscussions = mockDiscussions.filter(
    (d) =>
      (view === "all" || d.author === "Jane Doe") &&
      (categoryFilter === "All" || d.category === categoryFilter)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8 lg:px-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Discussions</h1>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm focus:outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 flex items-center gap-2 text-sm shadow">
            <FaPlus />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>

      {/* Toggle Menu */}
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded-full text-sm ${
            view === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setView("all")}
        >
          All Discussions
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm ${
            view === "mine"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setView("mine")}
        >
          My Discussions
        </button>
      </div>

      {/* Discussion Cards */}
      <div className="space-y-6">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition duration-200 border flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-blue-700 mb-1">
                  {discussion.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Posted by {discussion.author} · {discussion.date}
                </p>
                <p className="text-sm text-gray-600">
                  {discussion.comments} comments
                </p>
              </div>
              <button
                className="mt-4 sm:mt-0 text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                aria-label="View More"
              >
                <span className="hidden sm:inline">View More</span>
                <FaArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No discussions found.</p>
        )}
      </div>
    </div>
  );
};

export default Discussions;
