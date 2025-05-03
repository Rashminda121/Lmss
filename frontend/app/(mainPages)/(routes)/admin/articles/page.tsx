"use client";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaSearch,
  FaHeart,
  FaComment,
  FaTimes,
  FaImage,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Swal from "sweetalert2";
import axios from "axios";

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

const AdminArticles = () => {
  const categories = [
    "General",
    "Technology",
    "Health",
    "Education",
    "Skills",
    "Careers",
    "Other",
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [data, setData] = useState<Article[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const { user } = useUser();

  const articlesPerPage = 5;

  // Responsive effect
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasFetchedData = useRef(false);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const getData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/listArticles`);
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

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        _id: "",
        uid: user ? user.id : "",
        author: "",
        title: "",
        description: "",
        image: "",
        url: "",
        category: "",
      });
      setImagePreview(null);
      setIsEditMode(false);
    }
  }, [isModalOpen, user]);

  // Filter articles based on search term
  const filteredArticles = data.filter((article) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.description.toLowerCase().includes(searchLower) ||
      article.author.toLowerCase().includes(searchLower) ||
      article.category.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Form state
  const [formData, setFormData] = useState({
    _id: "",
    uid: user ? user.id : "",
    author: "",
    title: "",
    description: "",
    image: "",
    url: "",
    category: "",
  });

  // Image upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "File size should be less than 5MB",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setIsUploading(false);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "Error reading image file",
        showConfirmButton: false,
        timer: 3000,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "User not authenticated",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    try {
      const endpoint = isEditMode
        ? `${backendUrl}/api/admin/updateArticle`
        : `${backendUrl}/api/admin/addArticle`;

      const payload = {
        ...formData,
        uid: user.id,
      };

      const response = isEditMode
        ? await axios.put(endpoint, payload)
        : await axios.post(endpoint, payload);

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: isEditMode
          ? "Article updated successfully!"
          : "Article added successfully!",
        showConfirmButton: false,
        timer: 3000,
      });

      setIsModalOpen(false);
      getData();
    } catch (error: any) {
      console.error("Failed to submit article:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} article`,
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const handleEdit = (article: Article) => {
    setIsEditMode(true);
    setFormData({
      _id: article._id,
      uid: article.uid,
      author: article.author,
      title: article.title,
      description: article.description,
      image: article.image,
      url: article.url,
      category: article.category,
    });
    if (article.image) {
      setImagePreview(article.image);
    }
    setIsModalOpen(true);
  };
  
  const handleDelete = async (articleId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${backendUrl}/api/admin/deleteArticle`, {
          data: { _id: articleId },
        });
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Article deleted successfully!",
          showConfirmButton: false,
          timer: 3000,
        });
        getData();
      } catch (error) {
        console.error("Failed to delete article:", error);
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "Failed to delete article",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
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

  // Responsive table columns
  const showImageColumn = windowWidth > 768;
  const showStatsColumn = windowWidth > 640;
  const showCategoryColumn = windowWidth > 768;

  return (
    <div className="p-4 mt-5 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Article Management
            </h2>
            <p className="text-gray-600 mt-1 md:mt-2">
              Manage all published articles
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsEditMode(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaPlus className="mr-2" />
              <span className="whitespace-nowrap">Add Article</span>
            </button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    {showImageColumn && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    {/* {showStatsColumn && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stats
                      </th>
                    )} */}
                    {showCategoryColumn && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                    )}
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentArticles.length > 0 ? (
                    currentArticles.map((article) => (
                      <tr
                        key={article._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {article.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {article.description}
                            </div>
                            <div className="text-xs text-blue-600 hover:underline mt-1">
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {article.url}
                              </a>
                            </div>
                            {!showImageColumn && (
                              <div className="mt-2">
                                {article.image && (
                                  <img
                                    src={article.image}
                                    alt={article.title}
                                    className="h-8 w-8 rounded object-cover"
                                  />
                                )}
                              </div>
                            )}
                            {!showCategoryColumn && (
                              <div className="mt-1">
                                <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 px-2">
                                  {article.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {showImageColumn && (
                          <td className="px-4 py-4">
                            {article.image && (
                              <img
                                src={article.image}
                                alt={article.title}
                                className="h-10 w-10 rounded object-cover"
                              />
                            )}
                          </td>
                        )}
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {article.author}
                          </div>
                        </td>
                        {/* {showStatsColumn && (
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center text-sm text-gray-500">
                                <FaHeart className="text-red-500 mr-1" />
                                {article.likes}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <FaComment className="text-blue-500 mr-1" />
                                {article.comments}
                              </div>
                            </div>
                          </td>
                        )} */}
                        {showCategoryColumn && (
                          <td className="px-4 py-4">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {article.category}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(article)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit"
                            >
                              <FaEdit className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(article._id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
                            >
                              <FaTrashAlt className="h-4 w-4 md:h-5 md:w-5" />
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
                        No articles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
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
                className={`ml-3 relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
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
                  <span className="font-medium">{indexOfFirstArticle + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastArticle, filteredArticles.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredArticles.length}</span>{" "}
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
                        className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
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

      {/* Add/Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {isEditMode ? "Edit Article" : "Add New Article"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
            <div className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter article title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter article description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/article"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Upload
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        ) : (
                          <>
                            <FaImage className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 text-center px-2">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, JPEG (Max. 5MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    {(imagePreview || formData.image) && (
                      <div className="relative">
                        <img
                          src={imagePreview || formData.image}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({ ...prev, image: "" }));
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    {isEditMode ? "Update Article" : "Add Article"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
