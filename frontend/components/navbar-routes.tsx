"use client";

import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isLecturer } from "@/lib/teacher";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const NavbarRoutes = () => {
  const [checkLecturer, setCheckLecturer] = useState(false);
  const pathname = usePathname();

  const { userId } = useAuth();
  const user = useUser();
  const hasFetchedData = useRef(false);

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname.includes("/courses");
  const isSearchPage = pathname === "/search";

  const fetchAndCheckUser = async () => {
    if (!userId || !user || !user.isLoaded) return;

    const userEmail = user.user
      ? user.user.emailAddresses[0]?.emailAddress
      : "";
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

    try {
      const response = await axios.get(
        `${backendUrl}/user/userProfile?uid=${userId}&email=${userEmail}`
      );

      setCheckLecturer(isLecturer(response.data.role));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current && user.isLoaded && user && userId) {
      fetchAndCheckUser();
      hasFetchedData.current = true;
    }
  }, [userId, user.isLoaded, user]);

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      {!isSearchPage && !isCoursePage && user.isLoaded && user.isSignedIn && (
        <div className="hidden md:block">
          <h1 className="text-base md:text-lg font-semibold">
            Hello,{" "}
            <span className="text-sm md:text-base text-blue-800">
              {user.user?.fullName || "Guest"}
            </span>
          </h1>
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : checkLecturer ? (
          <Link href="/teacher/courses">
            <Button size="sm" className="text-xs md:text-sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
