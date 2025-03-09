"use client";
import React, { useState, useEffect } from "react";
import ArticleCard from "./components/articleCard";

const Articles: React.FC = () => {
  const articles = [
    <ArticleCard />,
    <ArticleCard />,
    <ArticleCard />,
    <ArticleCard />,
    <ArticleCard />,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1); // Default to showing 1 article

  // Adjust number of articles to display based on window size
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth <= 768) {
        setItemsToShow(1); // Mobile: 1 article at a time
      } else {
        setItemsToShow(3); // Non-mobile: 3 articles at a time
      }
    };
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      // Move to the first slide if at the end
      return prevIndex >= articles.length - itemsToShow ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      // Move to the last slide if at the start
      return prevIndex === 0 ? articles.length - itemsToShow : prevIndex - 1;
    });
  };

  return (
    <div className="p-[5px] md:p-[20px] flex flex-col items-center justify-center">
      <div className="relative flex items-center text-center mb-5 pt-5">
        <h1 className="flex items-center justify-center text-xl md:text-2xl font-semibold flex-grow text-center">
          <img src="/writing.png" className="w-5 h-5 mr-2 z-10 bg-white" />
          Articles
        </h1>
      </div>
      <div className="w-full md:w-[70%] flex justify-center overflow-hidden relative">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            width: `${(articles.length / itemsToShow) * 100}%`,
          }}
        >
          {articles.map((article, index) => (
            <div
              className="flex justify-center items-center p-2"
              key={index}
              style={{
                flex: `0 0 ${100 / itemsToShow}%`,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {article}
            </div>
          ))}
        </div>
      </div>
      <div
        className="flex pb-5 justify-center md:justify-end md:pr-44"
        style={{
          marginTop: "10px",
          width: "90%",
        }}
      >
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0} // Disable if at the first slides
          className={`${
            currentIndex === 0
              ? "bg-gray-300 hover:bg-red-300 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          } text-black text-xs md:text-sm border-none px-4 py-2 md:px-6 md:py-2 rounded mr-2`}
        >
          Prev
        </button>
        <button
          onClick={nextSlide}
          className={`bg-gray-700 text-white text-xs md:text-sm border-none px-4 py-2 md:px-6 md:py-2 rounded ${
            currentIndex >= articles.length - itemsToShow
              ? "hover:bg-gray-800"
              : "hover:bg-gray-500"
          }`}
        >
          {currentIndex >= articles.length - itemsToShow ? "First" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Articles;
