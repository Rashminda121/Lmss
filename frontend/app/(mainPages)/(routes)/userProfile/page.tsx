"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { FiInfo, FiPhone } from "react-icons/fi";
import { format, formatDistanceToNow } from "date-fns";

interface UserProfileData {
  _id: string;
  name?: string;
  email?: string;
  phone?: string | null;
  image?: string;
  role?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoaded } = useUser();

  const { signOut } = useClerk();

  const [formData, setFormData] = useState<UserProfileData>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    image: "",
    role: "",
    address: "",
    updatedAt: "",
  });

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    if (isLoaded && user) {
      getUser();
    }
  }, [isLoaded, user]);

  const getUser = async () => {
    if (!user) return;

    setLoading(true);

    const uid = encodeURIComponent(user.id ?? "");
    const email = encodeURIComponent(
      user.primaryEmailAddress?.emailAddress ?? ""
    );

    try {
      const response = await fetch(
        `${backendUrl}/user/userProfile?uid=${uid}&email=${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && typeof data === "object") {
        setUserProfile(data);
        setFormData({
          _id: data._id || "",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          image: data.image || "",
          role: data.role || "",
          address: data.address || "",
          updatedAt: data.updatedAt || "",
        });
      } else {
        console.error("Invalid user profile data:", data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const openEditModal = () => {
    setImagePreview(userProfile?.image || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/user/updateUser`,
        formData
      );

      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Profile updated successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__bounceInDown",
        },
        hideClass: {
          popup: "animate__animated animate__bounceOutUp",
        },
      });

      setIsModalOpen(false);
      getUser(); // Refresh user data
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__bounceInDown",
        },
        hideClass: {
          popup: "animate__animated animate__bounceOutUp",
        },
      });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this! Your account will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await axios.delete(`${backendUrl}/user/deleteUser`, {
          data: { _id: userProfile?._id },
        });

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Account deleted successfully!",
          showConfirmButton: false,
          timer: 3000,
        });

        signOut({ redirectUrl: "/" });
      }
    } catch (error: any) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: error.response?.data?.message || "Failed to delete account",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4 sm:p-6">
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-2xl overflow-hidden p-4 sm:p-6 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-center text-gray-500 text-lg animate-pulse">
              Loading user profile...
            </p>
          </div>
        ) : userProfile ? (
          <>
            {/* Profile Card Container */}
            <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
                {/* Action Buttons Container */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    className="group flex items-center justify-center p-3 rounded-full shadow-md bg-blue-100 hover:bg-blue-600 transition-all duration-200"
                    onClick={openEditModal}
                    title="Edit User Profile"
                  >
                    <Pencil
                      size={20}
                      className="text-blue-700 group-hover:text-white transition-colors duration-200"
                    />
                    <span className="ml-1 text-sm font-medium text-blue-700 group-hover:text-white transition-colors duration-200 hidden sm:inline">
                      Edit
                    </span>
                  </button>

                  <button
                    className="group flex items-center justify-center p-3 rounded-full shadow-md bg-red-100 hover:bg-red-600 transition-all duration-200"
                    onClick={handleDelete}
                    title="Delete User Profile"
                  >
                    <Trash2
                      size={20}
                      className="text-red-700 group-hover:text-white transition-colors duration-200"
                    />
                    <span className="ml-1 text-sm font-medium text-red-700 group-hover:text-white transition-colors duration-200 hidden sm:inline">
                      Delete
                    </span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-2">
                  <div className="relative">
                    <img
                      src={userProfile?.image || "/profile-user.png"}
                      alt="User Profile"
                      width={128}
                      height={128}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {userProfile?.role || "USER"}
                    </div>
                  </div>

                  <div className="text-center sm:text-left mt-2 sm:mt-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {userProfile?.name || "No Name"}
                    </h2>
                    <p className="text-blue-600 text-sm sm:text-base mt-1">
                      {userProfile?.email || "No Email"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Details Sections */}
              <div className="divide-y divide-gray-100">
                <div className="p-4 sm:p-6 md:p-8">
                  <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                    <FiPhone className="text-blue-500" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="border border-gray-100 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-sm md:text-base text-gray-800">
                        {userProfile?.phone || "Not provided"}
                      </p>
                    </div>

                    <div className="border border-gray-100 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <p className="text-xs md:text-sm text-gray-500">
                        Address
                      </p>
                      <textarea
                        readOnly
                        rows={1}
                        className="w-full resize-y font-medium text-sm md:text-base text-gray-800 bg-transparent border-none focus:outline-none overflow-y-auto"
                        value={userProfile?.address || "Not provided"}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="p-4 sm:p-6 md:p-8">
                  <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                    <FiInfo className="text-blue-500" />
                    Additional Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="border border-gray-100 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <p className="text-xs md:text-sm text-gray-500">
                        Join Date
                      </p>
                      {userProfile?.createdAt ? (
                        <p className="font-medium text-sm md:text-base text-gray-800">
                          {format(
                            new Date(userProfile.createdAt),
                            "MMMM d, yyyy"
                          )}
                          <br />
                          <span className="text-sm md:text-base text-gray-500">
                            (
                            {formatDistanceToNow(
                              new Date(userProfile.createdAt),
                              { addSuffix: true }
                            )}
                            )
                          </span>
                        </p>
                      ) : (
                        <p className="font-medium text-gray-800">
                          Not available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            User profile not found
          </p>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-100 bg-gray-50 shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Update Profile
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div className="flex justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={triggerFileInput}
                    className="relative cursor-pointer"
                  >
                    <img
                      src={imagePreview || "/profile-user.png"}
                      alt="Profile Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-200 object-cover shadow-md"
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 sm:p-2 rounded-full">
                      <Pencil size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    rows={3}
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your address"
                  ></textarea>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Update Profile
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

export default UserProfile;
