"use client";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLink,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const AdminEvents = () => {
  const allEvents = [
    {
      id: 1,
      email: "organizer1@example.com",
      title: "Tech Conference 2023",
      description: "Annual technology conference featuring top speakers",
      date: "2023-11-15",
      location: "Convention Center, San Francisco",
      eventUrl: "https://techconf.example.com",
      image: "https://source.unsplash.com/random/300x200/?conference",
      category: "Technology",
      type: "Conference",
      status: "Active",
      comment_count: 42,
      createdAt: "2023-09-01",
    },
    {
      id: 2,
      email: "organizer2@example.com",
      title: "Music Festival",
      description: "Three days of live music and performances",
      date: "2023-12-10",
      location: "Central Park, New York",
      eventUrl: "https://musicfest.example.com",
      image: "https://source.unsplash.com/random/300x200/?festival",
      category: "Music",
      type: "Festival",
      status: "Upcoming",
      comment_count: 18,
      createdAt: "2023-10-15",
    },
    {
      id: 3,
      email: "organizer3@example.com",
      title: "Art Exhibition",
      description: "Contemporary art from emerging artists",
      date: "2023-11-20",
      location: "Modern Art Museum, Chicago",
      eventUrl: "https://artexhibit.example.com",
      image: "https://source.unsplash.com/random/300x200/?art",
      category: "Art",
      type: "Exhibition",
      status: "Active",
      comment_count: 25,
      createdAt: "2023-08-20",
    },
    {
      id: 4,
      email: "organizer4@example.com",
      title: "Charity Run",
      description: "5K run to support local charities",
      date: "2023-12-05",
      location: "City Park, Boston",
      eventUrl: "https://charityrun.example.com",
      image: "https://source.unsplash.com/random/300x200/?running",
      category: "Sports",
      type: "Charity",
      status: "Upcoming",
      comment_count: 12,
      createdAt: "2023-09-10",
    },
    {
      id: 5,
      email: "organizer5@example.com",
      title: "Startup Pitch Night",
      description: "Early-stage startups pitch to investors",
      date: "2023-11-25",
      location: "Innovation Hub, Austin",
      eventUrl: "https://startuppitch.example.com",
      image: "https://source.unsplash.com/random/300x200/?startup",
      category: "Business",
      type: "Networking",
      status: "Active",
      comment_count: 30,
      createdAt: "2023-10-01",
    },
    {
      id: 6,
      email: "organizer6@example.com",
      title: "Food & Wine Tasting",
      description: "Sample gourmet food and fine wines",
      date: "2023-12-15",
      location: "Grand Hotel, Miami",
      eventUrl: "https://foodwine.example.com",
      image: "https://source.unsplash.com/random/300x200/?food",
      category: "Food",
      type: "Tasting",
      status: "Upcoming",
      comment_count: 8,
      createdAt: "2023-10-20",
    },
    {
      id: 7,
      email: "organizer7@example.com",
      title: "Workshop: Digital Marketing",
      description: "Learn digital marketing strategies",
      date: "2023-11-30",
      location: "Business Center, Seattle",
      eventUrl: "https://marketingworkshop.example.com",
      image: "https://source.unsplash.com/random/300x200/?workshop",
      category: "Education",
      type: "Workshop",
      status: "Active",
      comment_count: 15,
      createdAt: "2023-09-15",
    },
    {
      id: 8,
      email: "organizer8@example.com",
      title: "Film Premiere",
      description: "World premiere of independent film",
      date: "2023-12-20",
      location: "Paramount Theater, Los Angeles",
      eventUrl: "https://filmpremiere.example.com",
      image: "https://source.unsplash.com/random/300x200/?movie",
      category: "Entertainment",
      type: "Premiere",
      status: "Upcoming",
      comment_count: 22,
      createdAt: "2023-11-01",
    },
    {
      id: 9,
      email: "organizer9@example.com",
      title: "Book Signing",
      description: "Meet the author and get signed copies",
      date: "2023-12-01",
      location: "Bookstore, Portland",
      eventUrl: "https://booksigning.example.com",
      image: "https://source.unsplash.com/random/300x200/?book",
      category: "Literature",
      type: "Signing",
      status: "Active",
      comment_count: 10,
      createdAt: "2023-10-05",
    },
    {
      id: 10,
      email: "organizer10@example.com",
      title: "Yoga Retreat",
      description: "Weekend yoga and meditation retreat",
      date: "2024-01-10",
      location: "Mountain Resort, Denver",
      eventUrl: "https://yogaretreat.example.com",
      image: "https://source.unsplash.com/random/300x200/?yoga",
      category: "Wellness",
      type: "Retreat",
      status: "Upcoming",
      comment_count: 5,
      createdAt: "2023-11-05",
    },
    {
      id: 11,
      email: "organizer11@example.com",
      title: "Science Fair",
      description: "Student science projects exhibition",
      date: "2024-01-15",
      location: "High School, Dallas",
      eventUrl: "https://sciencefair.example.com",
      image: "https://source.unsplash.com/random/300x200/?science",
      category: "Education",
      type: "Fair",
      status: "Upcoming",
      comment_count: 7,
      createdAt: "2023-11-10",
    },
    {
      id: 12,
      email: "organizer12@example.com",
      title: "Vintage Car Show",
      description: "Display of classic and vintage cars",
      date: "2024-02-05",
      location: "Fairgrounds, Detroit",
      eventUrl: "https://carshow.example.com",
      image: "https://source.unsplash.com/random/300x200/?car",
      category: "Automotive",
      type: "Exhibition",
      status: "Upcoming",
      comment_count: 14,
      createdAt: "2023-11-15",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  // Filter events based on search term
  const filteredEvents = allEvents.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.email.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower) ||
      event.category.toLowerCase().includes(searchLower) ||
      event.type.toLowerCase().includes(searchLower) ||
      event.status.toLowerCase().includes(searchLower)
    );
  });

  // Get current events for pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEdit = (eventId: number) => {
    console.log("Edit event:", eventId);
    // Add your edit logic here
  };

  const handleDelete = (eventId: number) => {
    console.log("Delete event:", eventId);
    // Add your delete logic here
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Event Management
            </h2>
            <p className="text-gray-600 mt-2">Manage all registered events</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
              <FaPlus className="mr-2" />
              Add Event
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Organizer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category/Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Engagement
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEvents.length > 0 ? (
                    currentEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-24">
                              <img
                                className="h-16 w-24 rounded-md object-cover"
                                src={event.image}
                                alt={event.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {event.description}
                              </div>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <FaCalendarAlt className="mr-1" />
                                {event.date}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <FaMapMarkerAlt className="mr-1" />
                                {event.location}
                              </div>
                              <div className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                                <FaLink className="mr-1" />
                                <a
                                  href={event.eventUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Event Link
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {event.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">Date:</div>
                            <div className="text-gray-500">{event.date}</div>
                          </div>
                          <div className="mt-2 text-sm text-gray-900">
                            <div className="font-medium">Location:</div>
                            <div className="text-gray-500">
                              {event.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">Category:</span>{" "}
                            {event.category}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Type:</span>{" "}
                            {event.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              event.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : event.status === "Upcoming"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Comments: {event.comment_count}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEdit(event.id)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
                            >
                              <FaTrashAlt className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No events found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstEvent + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastEvent, filteredEvents.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredEvents.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                      currentPage === 1
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                      currentPage === totalPages
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
