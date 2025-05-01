"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface UserProfileData {
  name?: string;
  email?: string;
  phone?: string | null;
  image?: string;
  role?: string;
  address?: string;
  updatedAt?: string;
}

const SubNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      getUser();
    }
  }, [isLoaded, user]);

  const getUser = async () => {
    if (!user) return;

    setLoading(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("Backend URL is not defined.");
      return;
    }

    const uid = encodeURIComponent(user.id ?? "");
    const email = encodeURIComponent(
      user.primaryEmailAddress?.emailAddress ?? ""
    );

    try {
      const response = await fetch(
        `${backendUrl}/user/userProfile?uid=${uid}&email=${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && typeof data === "object") {
        setUserProfile(data);
      } else {
        console.error("Invalid user profile data:", data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const { signOut } = useClerk();

  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathName = usePathname();

  const settingActiveItem = () => {
    if (pathName === "/admin") {
      setActiveItem("admin");
    } else if (pathName === "/mainPage") {
      setActiveItem("Home");
    } else if (pathName === "/about") {
      setActiveItem("About");
    } else if (pathName === "/discussions") {
      setActiveItem("Discussions");
    } else if (pathName === "/events") {
      setActiveItem("Events");
    } else if (pathName === "/communityArticles") {
      setActiveItem("Articles");
    }
  };

  useEffect(() => {
    settingActiveItem();
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
    setIsModalOpen(false);
  };

  const menuItems = [
    { name: "Home", path: "/mainPage" },
    { name: "About", path: "/about" },
    { name: "Discussions", path: "/discussions" },
    { name: "Events", path: "/events" },
    { name: "Articles", path: "/communityArticles" },
    { name: "Contact", path: "#contact" },
  ];

  const handleItemClick = (item: any) => {
    setActiveItem(item.name);
    setIsMenuOpen(false);
  };

  const handleProfile = () => {
    router.push("/userProfile");
  };

  return (
    <nav className="bg-gray-200 p-3 px-9 z-20">
      <div className="flex items-center justify-between">
        <div className="text-black font-extrabold text-lg flex flex-row space-x-4 items-center">
          <img src="/owl.png" className="w-8 h-8" alt="" />
          <a href="/mainPage">
            <span>Lumina</span>
          </a>
        </div>

        <div className="hidden sm:flex sm:space-x-4 flex-1 justify-center">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.path} passHref>
              <button
                className={`p-2 transition-colors duration-300 font-semibold ${
                  activeItem === item.name
                    ? "text-blue-700"
                    : "text-black hover:text-blue-700"
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item.name}
              </button>
            </Link>
          ))}

          {userProfile && userProfile.role === "admin" && (
            <Link key="admin-dashboard" href="/admin/dashboard" passHref>
              <button
                className={`p-2 transition-colors duration-300 font-semibold ${
                  activeItem === "admin"
                    ? "text-blue-700"
                    : "text-black hover:text-blue-700"
                }`}
                onClick={() => handleItemClick({ name: "admin" })}
              >
                Admin
              </button>
            </Link>
          )}
        </div>

        {/* Sign in Button in the right corner */}
        <div className="relative hidden sm:block" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            // onMouseEnter={() => !isOpen && setIsOpen(true)}
            className="border border-black text-black text-sm font-semibold p-2 rounded-full flex items-center gap-2 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src="/profile-user.png"
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 border border-slate-400 bg-white shadow-lg rounded-md overflow-hidden">
              <ul className="text-black text-center">
                <li
                  onClick={handleProfile}
                  className="px-4 py-2 border border-transparent rounded-md hover:border-gray-800 hover:bg-gray-200 cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span>Profile</span>
                </li>

                <li
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 cursor-pointer"
                >
                  <div className="hidden sm:block">
                    <button className="bg-black hover:bg-gray-700 hover:scale-105 text-white text-sm font-semibold p-2 px-8 rounded transition-all duration-300">
                      Sign out
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Button to toggle menu on mobile */}
        <button
          className="text-black sm:hidden ml-4 font-bold text-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile View */}
      <div
        className={`flex-1 flex flex-col items-center mt-2 mb-5 ${
          isMenuOpen ? "block" : "hidden"
        } sm:hidden`}
      >
        <div className="flex flex-col space-y-2 text-center">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`p-2 transition-colors duration-300 font-semibold ${
                activeItem === item.name
                  ? "text-blue-700"
                  : "text-black hover:text-blue-700"
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item.name}
            </a>
          ))}

          <button
            onClick={() => {
              handleProfile();
              setIsMenuOpen(false);
            }}
            className="p-2 transition-colors duration-300 font-semibold text-black hover:text-blue-700"
          >
            Profile
          </button>
          {userProfile && userProfile.role === "admin" && (
            <Link key="admin-dashboard" href="/admin/dashboard" passHref>
              <button
                className={`p-2 transition-colors duration-300 font-semibold ${
                  activeItem === "admin"
                    ? "text-blue-700"
                    : "text-black hover:text-blue-700"
                }`}
                onClick={() => handleItemClick({ name: "admin" })}
              >
                Admin
              </button>
            </Link>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white text-sm font-semibold p-2 px-6 rounded"
          >
            Sign out
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md xs:px-4 sm:px-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 text-center">
              Are you sure you want to sign out?
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 justify-center sm:gap-4">
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md w-full sm:w-auto transition duration-200 ease-in-out transform hover:scale-105"
              >
                Yes, Sign out
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-md w-full sm:w-auto transition duration-200 ease-in-out transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SubNavbar;
