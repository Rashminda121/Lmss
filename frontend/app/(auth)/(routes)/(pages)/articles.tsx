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
  readTime: string;
  author: string;
  likes: number;
  comments: number;
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
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Failed to fetch articles",
        showConfirmButton: false,
        timer: 3000,
      });
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <FaBookOpen className="text-indigo-600 text-2xl mr-3" />
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
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
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsToShow)
                }%)`,
              }}
            >
              {data.map((article, index) => (
                <div
                  key={article._id}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    {article.image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                          {article.category}
                        </span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                          title="View full article"
                        >
                          <FaLink className="text-lg" />
                        </a>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-1 line-clamp-4">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-gray-500">
                          {article.readTime || "5 min read"}
                        </span>
                        <span className="text-sm font-medium text-indigo-600">
                          {article.author}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 p-3 rounded-full bg-white shadow-md text-gray-800 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
            aria-label="Previous article"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex >= data.length - itemsToShow}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 p-3 rounded-full bg-white shadow-md text-gray-800 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
            aria-label="Next article"
          >
            <FaArrowRight />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(data.length / itemsToShow) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * itemsToShow)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex >= i * itemsToShow &&
                  currentIndex < (i + 1) * itemsToShow
                    ? "bg-indigo-600"
                    : "bg-gray-300"
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
