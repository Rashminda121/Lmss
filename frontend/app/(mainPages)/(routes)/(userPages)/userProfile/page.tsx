"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

interface UserProfileData {
  name?: string;
  email?: string;
  phone?: string | null;
  image?: string;
  role?: string;
  address?: string;
  updatedAt?: string;
}

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      getUser();
    }
  }, [isLoaded, user]);

  const getUser = async () => {
    if (!user) return;

    setLoading(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error("Backend URL is not defined.");
      return;
    }

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
      } else {
        console.error("Invalid user profile data:", data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }

    console.log(userProfile);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-6">
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-2xl overflow-hidden p-8">
        {/* Edit Button */}
        <button
          className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 transition-all"
          onClick={() => console.log("Edit Profile Clicked")}
        >
          <Pencil size={20} className="text-gray-700" />
        </button>

        {loading ? (
          <p className="text-center text-gray-500 text-lg animate-pulse">
            Loading user profile...
          </p>
        ) : userProfile ? (
          <>
            {/* Profile Image */}
            <div className="flex justify-center">
              <img
                src={userProfile.image || "/profile-user.png"}
                alt="User Profile"
                width={128}
                height={128}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-200 object-cover shadow-md"
              />
            </div>

            {/* User Details */}
            <div className="text-center mt-5 sm:mt-7 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {userProfile.name || "No Name"}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                {userProfile.email || "No Email"}
              </p>
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                {userProfile.phone || "No Phone"}
              </p>

              <div className="mt-4 inline-block px-4 py-2 text-sm sm:text-md font-semibold bg-blue-500 text-white rounded-full shadow-md">
                {userProfile.role || "No Role"}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            User profile not found.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
