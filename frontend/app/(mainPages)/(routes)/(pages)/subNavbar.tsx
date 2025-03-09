"use client";

import { useClerk } from "@clerk/nextjs";
import React, { useState } from "react";

const SubNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { signOut } = useClerk();

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
          <a href="">
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
        <div className="hidden sm:block">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white text-sm font-semibold p-2 px-6 rounded "
          >
            Sign out
          </button>
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
