"use client";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, userId } = useAuth();
  const { isSignedIn, user } = useUser();
  const [isLecturer, setIsLecturer] = useState<boolean | null>(null);
  const hasCheckedAuth = useRef(false);
  const router = useRouter();

  const userEmail = user?.emailAddresses?.[0]?.emailAddress ?? "";

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasCheckedAuth.current) return;

    const getUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/user/userProfile?uid=${userId}&email=${userEmail}`
        );
        setIsLecturer(
          response.data.role === "lecturer" || response.data.role === "admin"
        );
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsLecturer(false);
      } finally {
        hasCheckedAuth.current = true;
      }
    };

    getUserData();
  }, [isLoaded, isSignedIn, userId, userEmail]);

  useEffect(() => {
    if (isLecturer === false && hasCheckedAuth.current) {
      router.push("/");
    }
  }, [isLecturer, router]);

  if (!isLoaded || isLecturer === null) {
    return null;
  }

  if (!isLecturer) {
    return null;
  }

  return <>{children}</>;
};

export default TeacherLayout;
