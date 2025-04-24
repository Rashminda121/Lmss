"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

export const isLecturer = (userRole?: string | null) => {
  return userRole === "lecturer" || userRole === "admin";
};

export const isTeacher = (userId?: string | null) => {
  let userCheck = false;

  const isCheckLecturer = isLecturerCheck();

  const checkUser = () => {
    if (isCheckLecturer && userId !== null) {
      userCheck = true;
    } else {
      userCheck = false;
    }
  };

  if (userId !== null) {
    checkUser();
  }

  return userCheck;
  // return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
};

export const isLecturerCheck = () => {
  const user = useUser();
  const { userId } = useAuth();
  const [isLecturer, setIsLecturer] = useState(false);
  const hasFetchedData = useRef(false);

  const userEmail = user.user ? user.user.emailAddresses[0]?.emailAddress : "";

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/user/userProfile?uid=${userId}&email=${userEmail}`
        );
        if (
          response.data.role === "lecturer" ||
          response.data.role === "admin"
        ) {
          setIsLecturer(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (!hasFetchedData.current && user) {
      getUserData();
      hasFetchedData.current = true;
    }
  }, [user]);

  return isLecturer;
};
