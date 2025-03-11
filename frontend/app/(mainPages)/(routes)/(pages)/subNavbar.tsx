"use client";

import { useClerk } from "@clerk/nextjs";
import React, { useEffect, useRef, useState } from "react";

const SubNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { signOut } = useClerk();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    { name: "Home", path: "#home" },
    { name: "About", path: "#about" },
    { name: "Articles", path: "#articles" },
    { name: "Contact", path: "#contact" },
  ];

  const handleItemClick = (item: any) => {
    setActiveItem(item.name);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-200 p-3 px-9 z-20">
      <div className="flex items-center justify-between">
        <div className="text-black font-extrabold text-lg flex flex-row space-x-4 items-center">
          <img src="/owl.gif" className="w-10 h-10" alt="" />
          <a href="/mainPage">
            <span>Lumina</span>
          </a>
        </div>

        {/* Centered Menu Items */}
        <div className="hidden sm:flex sm:space-x-4 flex-1 justify-center">
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
        </div>

        {/* Sign in Button in the right corner */}
        <div className="relative hidden sm:block" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setIsOpen(true)}
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
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden">
              <ul className="text-black">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <div className="hidden sm:block">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-black text-white text-sm font-semibold p-2 px-6 rounded"
                    >
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
          <a
            href="#profile"
            className="p-2 transition-colors duration-300 font-semibold text-black hover:text-blue-700"
          >
            Profile
          </a>
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
