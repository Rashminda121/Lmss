"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

interface ViewEventProps {
  params: {
    id: string;
  };
}

interface Event {
  _id: string;
  uid: string;
  title: string;
  date: Date;
  location: string;
  coordinates: object;
  description: string;
  category: string;
  type: string;
  url: string;
  image: string;
}

export default function ViewEvent({ params }: ViewEventProps) {
  const { id } = params;
  const [data, setData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        // Replace with actual API call
        // await fetch(`/api/events/${id}`, { method: 'DELETE' });

        // Mock deletion
        console.log(`Event ${id} deleted`);
        window.location.href = "/"; // Redirect after deletion
      } catch (error) {
        console.error("Failed to delete event:", error);
        setError("Failed to delete event");
      }
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Mock data for demonstration
        const mockEvent: Event = {
          _id: id,
          uid: "user123",
          title: "Annual Tech Conference 2023",
          date: new Date("2023-11-15T09:00:00"),
          location: "Convention Center, San Francisco",
          coordinates: {},
          description:
            "Join us for the biggest tech conference of the year featuring keynote speakers, workshops, and networking opportunities with industry leaders.",
          category: "Technology",
          type: "In-person",
          url: "https://techconf2023.com",
          image:
            "https://images.unsplash.com/photo-1505377059061-51e0e9040d5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        };

        setData(mockEvent);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setError("Failed to load event data");
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error}</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Event not found
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Head>
        <title>{data.title} | Event Details</title>
        <meta name="description" content={data.description.substring(0, 160)} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75"></div>
          <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 text-white w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 rounded-full text-xs sm:text-sm font-semibold mb-2">
                  {data.category}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 line-clamp-2">
                  {data.title}
                </h1>
                <p className="text-sm sm:text-base md:text-xl">
                  {formattedDate}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
                <Link
                  href={`/events/edit/${id}`}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-white text-gray-800 rounded hover:bg-gray-200 transition flex items-center text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Left Column */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  About This Event
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {data.description}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Location
                </h2>
                <div className="flex items-start mb-3 sm:mb-4">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">
                      {data.location}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {data.type} Event
                    </p>
                  </div>
                </div>
                {/* Map placeholder */}
                <div className="h-48 sm:h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm sm:text-base">
                    Map of {data.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Date & Time
                  </h3>
                  <div className="flex items-center text-gray-700 text-sm sm:text-base">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>{formattedDate}</p>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Event Type
                  </h3>
                  <div className="flex items-center text-gray-700 text-sm sm:text-base">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <p>{data.type}</p>
                  </div>
                </div>

                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold py-2 sm:py-3 px-4 rounded-lg transition duration-200 text-sm sm:text-base"
                >
                  Get Tickets
                </a>

                <button className="mt-3 sm:mt-4 w-full flex items-center justify-center text-blue-500 hover:text-blue-700 font-semibold py-2 px-4 rounded-lg border border-blue-500 hover:border-blue-700 transition duration-200 text-sm sm:text-base">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
