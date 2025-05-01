"use client";

import { SignInButton } from "@clerk/nextjs";
import React, { useState } from "react";

const MainNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("Home");

  const menuItems = [
    { name: "Home", path: "#home" },
    { name: "About", path: "#about" },
    { name: "Articles", path: "#articles" },
    { name: "Contact", path: "#contact" },
  ];

  const handleItemClick = (item: any) => {
    setActiveItem(item.name);
    setIsMenuOpen(false); // Close the menu after selecting an item
  };

  return (
    <nav className="bg-gray-200 p-3 px-9 z-20">
      <div className="flex items-center justify-between">
        <div className="text-black font-extrabold text-lg flex flex-row space-x-4 items-center">
          <img src="/owl.png" className="w-8 h-8" alt="" />
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
          <SignInButton mode="modal">
            <button className="bg-black text-white text-sm font-semibold p-2 px-6 rounded">
              Sign in
            </button>
          </SignInButton>
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
          <SignInButton mode="modal">
            <button className="bg-black text-white text-sm font-semibold p-2 px-6 rounded">
              Sign in
            </button>
          </SignInButton>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
