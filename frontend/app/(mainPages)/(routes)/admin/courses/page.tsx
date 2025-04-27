"use client";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaSearch,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const AdminCourses = () => {
  const allCourses = [
    {
      id: 1,
      title: "Introduction to React",
      description: "Learn the fundamentals of React.js",
      image:
        "https://s39613.pcdn.co/wp-content/uploads/2019/05/twice-the-brainpower-on-this-assignment-picture-id947895256.jpg",
      isPublished: true,
      category: "Web Development",
      createdAt: "2024-04-01",
      name: "John Doe",
      email: "johndoe@example.com",
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      description: "Deep dive into modern JavaScript features",
      image:
        "https://media.istockphoto.com/id/1500285927/photo/young-woman-a-university-student-studying-online.jpg?s=612x612&w=0&k=20&c=yvFDnYMNEJ6WEDYrAaOOLXv-Jhtv6ViBRXSzJhL9S_k=",
      isPublished: true,
      category: "Programming",
      createdAt: "2024-03-15",
      name: "Jane Smith",
      email: "janesmith@example.com",
    },
    {
      id: 3,
      title: "CSS Masterclass",
      description: "Master CSS and modern layout techniques",
      image: "https://via.placeholder.com/150",
      isPublished: false,
      category: "Web Design",
      createdAt: "2024-02-20",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
    },
    {
      id: 4,
      title: "Node.js Fundamentals",
      description: "Backend development with Node.js",
      image: "https://via.placeholder.com/150",
      isPublished: true,
      category: "Web Development",
      createdAt: "2024-01-10",
      name: "Bob Brown",
      email: "bobbrown@example.com",
    },
    {
      id: 5,
      title: "Python for Beginners",
      description: "Learn Python programming from scratch",
      image: "https://via.placeholder.com/150",
      isPublished: true,
      category: "Programming",
      createdAt: "2023-12-05",
      name: "Eve White",
      email: "eve.white@example.com",
    },
    {
      id: 6,
      title: "UX Design Principles",
      description: "Essential UX design concepts",
      image: "https://via.placeholder.com/150",
      isPublished: false,
      category: "Design",
      createdAt: "2023-11-20",
      name: "Charlie Black",
      email: "charlie.black@example.com",
    },
    {
      id: 7,
      title: "Mobile App Development",
      description: "Build cross-platform mobile apps",
      image: "https://via.placeholder.com/150",
      isPublished: true,
      category: "Mobile",
      createdAt: "2023-10-15",
      name: "David Green",
      email: "david.green@example.com",
    },
    {
      id: 8,
      title: "Data Science Basics",
      description: "Introduction to data analysis",
      image: "https://via.placeholder.com/150",
      isPublished: true,
      category: "Data Science",
      createdAt: "2023-09-10",
      name: "Fiona Blue",
      email: "fiona.blue@example.com",
    },
    {
      id: 9,
      title: "DevOps Fundamentals",
      description: "CI/CD and deployment strategies",
      image: "https://via.placeholder.com/150",
      isPublished: false,
      category: "DevOps",
      createdAt: "2023-08-05",
      name: "Grace Red",
      email: "grace.red@example.com",
    },
    {
      id: 10,
      title: "Machine Learning Intro",
      description: "Basic ML concepts and algorithms",
      image: "https://via.placeholder.com/150",
      isPublished: true,
      category: "AI",
      createdAt: "2023-07-01",
      name: "Henry Gold",
      email: "henry.gold@example.com",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  // Filter courses based on search term
  const filteredCourses = allCourses.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower)
    );
  });

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEdit = (courseId: number) => {
    console.log("Edit course:", courseId);
    // Add your edit logic here
  };

  const handleDelete = (courseId: number) => {
    console.log("Delete course:", courseId);
    // Add your delete logic here
  };

  const togglePublish = (courseId: number) => {
    console.log("Toggle publish status for course:", courseId);
    // Add your publish toggle logic here
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
              Course Management
            </h2>
            <p className="text-gray-600 mt-2">Manage all available courses</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
              <FaPlus className="mr-2" />
              Add Course
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
                      Course
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
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
                  {currentCourses.length > 0 ? (
                    currentCourses.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={course.image}
                                alt={course.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {course.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                            {course.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            className="text-sm text-gray-500 line-clamp-2 max-w-xs"
                            value={course.description}
                            readOnly
                          />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {course.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => togglePublish(course.id)}
                              className={`${
                                course.isPublished
                                  ? "text-green-600 hover:text-green-900"
                                  : "text-gray-600 hover:text-gray-900"
                              } transition-colors`}
                              title={
                                course.isPublished ? "Unpublish" : "Publish"
                              }
                            >
                              {course.isPublished ? (
                                <FaEye className="h-5 w-5" />
                              ) : (
                                <FaEyeSlash className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEdit(course.id)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(course.id)}
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
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No courses found
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
                  <span className="font-medium">{indexOfFirstCourse + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastCourse, filteredCourses.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredCourses.length}</span>{" "}
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

export default AdminCourses;
