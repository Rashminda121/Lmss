"use client";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { useEffect } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !user) {
      window.location.href = "/";
    }

    if (isLoaded && user) {
      handleAddUser();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-8 border-t-8 border-blue-500 rounded-full border-r-transparent border-b-transparent animate-spin"></div>
        <p className="mt-4 text-blue-500 text-lg font-semibold">Loading...</p>
      </div>
    );
  }
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

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

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed insent-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
