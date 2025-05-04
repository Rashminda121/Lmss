/*
 * Project: LMSS - Lumina
 * Author: Jayamuni Rashminda
 *
 * Description:
 * Lumina is a user-friendly and efficient learning management platform
 * designed for students and lecturers. It enables students to enroll in
 * courses, learn at their own pace, and engage in meaningful discussions.
 * Lecturers can effectively manage course content, monitor student progress,
 * and provide timely feedback. By incorporating intelligent tools and real-time
 * insights, Lumina enhances the overall learning experience, supports diverse
 * learning styles, and fosters collaboration within an academic environment.
 *
 * License: © Jayamuni Rashminda. All rights reserved.
 */

"use client";

import { useUser } from "@clerk/nextjs";
import {
  Bot,
  CalendarDays,
  FileText,
  GraduationCap,
  MessagesSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardCard from "../_components/dashboardCards";

const MainPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }

    if (isLoaded && user) {
      handleAddUser();
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const handleAddUser = async () => {
    if (!user) return;

    const userData = {
      uid: user?.id,
      name: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      image: user?.imageUrl,
    };

    try {
      const response = await fetch(`${backendUrl}/user/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      const token = data.token;

      localStorage.removeItem("token");
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const dashboardItems = [
    { icon: GraduationCap, name: "Courses", href: "./" },
    { icon: Bot, name: "Assistance", href: "./assistance" },
    { icon: MessagesSquare, name: "Discussions", href: "./discussions" },
    { icon: CalendarDays, name: "Events", href: "./events" },
    { icon: FileText, name: "Articles", href: "./communityArticles" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-2 dark:bg-gray-900">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">
        Main Menu
      </h2>

      {/* Dashboard Cards - Flexbox */}
      <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            icon={item.icon}
            name={item.name}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
