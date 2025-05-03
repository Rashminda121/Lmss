"use client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FaUsers,
  FaBookOpen,
  FaComments,
  FaRegCalendarAlt,
  FaNewspaper,
  FaPenSquare,
} from "react-icons/fa";

// Fixing the typo in the interface
interface DashboardData {
  userCount: number;
  courseCount: number; // Corrected the typo here
  discussionCount: number;
  eventCount: number;
  articleCount: number;
  commentCount: number;
}

const AdminDashboard = () => {
  const { user, isLoaded } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoaded && user) {
      getData();
    }
  }, [isLoaded, user]);

  const getData = async () => {
    if (!user) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("Backend URL is not defined.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/admin/dashboard`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Users",
      description: "Manage all registered users",
      icon: <FaUsers className="h-10 w-10" />,
      link: "/admin/users",
      color: "bg-blue-100 text-blue-600",
      count: dashboardData ? dashboardData.userCount : "0",
    },
    {
      title: "Courses",
      description: "Manage and create courses",
      icon: <FaBookOpen className="h-10 w-10" />,
      link: "/admin/courses",
      color: "bg-green-100 text-green-600",
      count: dashboardData ? dashboardData.courseCount : "0",
    },
    {
      title: "Discussions",
      description: "View and manage course discussions",
      icon: <FaComments className="h-10 w-10" />,
      link: "/admin/discussions",
      color: "bg-indigo-100 text-indigo-600",
      count: dashboardData ? dashboardData.discussionCount : "0",
    },
    {
      title: "Events",
      description: "Organize and manage educational events",
      icon: <FaRegCalendarAlt className="h-10 w-10" />,
      link: "/admin/events",
      color: "bg-yellow-100 text-yellow-600",
      count: dashboardData ? dashboardData.eventCount : "0",
    },
    {
      title: "Articles",
      description: "Write and publish educational articles",
      icon: <FaNewspaper className="h-10 w-10" />,
      link: "/admin/articles",
      color: "bg-teal-100 text-teal-600",
      count: dashboardData ? dashboardData.articleCount : "0",
    },
    {
      title: "Comments",
      description: "Moderate and manage user comments",
      icon: <FaPenSquare className="h-10 w-10" />,
      link: "/admin/comments",
      color: "bg-purple-100 text-purple-600",
      count: dashboardData ? dashboardData.commentCount : "0",
    },
  ];

  return (
    <div className="min-h-screen pt-10 bg-gray-50 p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Admin Dashboard
      </h1>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-8">
        {loading ? (
          <div className="w-full text-center py-12">
            <div className="w-16 h-16 border-8 border-t-8 border-blue-500 rounded-full border-r-transparent border-b-transparent animate-spin mx-auto"></div>
            <p className="mt-4 text-blue-500 text-lg font-semibold">
              Loading...
            </p>
          </div>
        ) : (
          cards.map((card, index) => (
            <Link
              href={card.link}
              key={index}
              className="transform transition-all hover:scale-105 hover:shadow-lg w-80"
            >
              <div
                className={`rounded-lg shadow-lg p-6 h-64 ${card.color} hover:bg-opacity-80 transition-all`}
              >
                <div className="flex items-center justify-start space-x-4">
                  <div className="p-4 rounded-full bg-white bg-opacity-60">
                    {card.icon}
                  </div>
                  <span className="text-2xl font-semibold text-gray-800">
                    {card.count}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2 opacity-80">
                  {card.description}
                </p>
                <div className="mt-4 text-sm font-medium flex items-center text-gray-600">
                  <span>View details</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
