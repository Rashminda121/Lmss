"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { FaArrowLeft, FaArrowRight, FaLink, FaBookOpen } from "react-icons/fa";

interface Article {
  _id: string;
  uid: string;
  title: string;
  description: string;
  image: string;
  url: string;
  author: string;
  category: string;
}

const Articles: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1);
  const [data, setData] = useState<Article[]>([]);
  const { user } = useUser();
  const hasFetchedData = useRef(false);

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/admin/listArticles"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      // Swal.fire({
      //   toast: true,
      //   position: "top",
      //   icon: "error",
      //   title: "Failed to fetch articles",
      //   showConfirmButton: false,
      //   timer: 3000,
      // });
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      getData();
      hasFetchedData.current = true;
    }
  }, []);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth <= 640) {
        setItemsToShow(1);
      } else if (window.innerWidth <= 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= data.length - itemsToShow ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - itemsToShow : prevIndex - 1
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <FaBookOpen className="text-blue-600 text-3xl mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl">
              Featured Articles
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover insightful content curated just for you
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out mb-4"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsToShow)
                }%)`,
              }}
            >
              {Array.isArray(data) && data.length > 0 ? (
                data.map((article) => (
                  <div
                    key={article._id}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / itemsToShow}%` }}
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-gray-100 hover:shadow-xl transition-all duration-300">
                      {article.image && (
                        <div className="h-56 overflow-hidden relative">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="inline-block bg-white/90 backdrop-blur-sm text-indigo-600 text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                              {article.category}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1 min-w-0">
                            <span className="line-clamp-2">
                              {article.title}
                            </span>
                          </h3>
                          {article.url && (
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0 mt-1 sm:mt-0"
                              title="View full article"
                            >
                              <FaLink className="text-xl" />
                            </a>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4 flex-1 max-h-24 overflow-y-auto no-scrollbar p-1 text-sm sm:text-base">
                          {article.description}
                        </p>
                        <div className="flex justify-end">
                          <span className="text-sm font-medium text-gray-500 italic">
                            - {article.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-full min-h-[16rem] text-gray-500 text-center">
                  No articles available.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 p-4 rounded-full bg-white shadow-lg text-gray-800 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
            aria-label="Previous article"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex >= data.length - itemsToShow}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 p-4 rounded-full bg-white shadow-lg text-gray-800 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
            aria-label="Next article"
          >
            <FaArrowRight className="text-xl" />
          </button>
        </div>

        <div className="flex justify-center mt-12 space-x-3">
          {Array.from({ length: Math.ceil(data.length / itemsToShow) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * itemsToShow)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex >= i * itemsToShow &&
                  currentIndex < (i + 1) * itemsToShow
                    ? "bg-indigo-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Articles;
