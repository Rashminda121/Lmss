"use client";

import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const { userId } = useAuth();
  const user = useUser();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname.includes("/courses");
  const isSearchPage = pathname === "/search";

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
        ) : isTeacher(userId) ? (
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
