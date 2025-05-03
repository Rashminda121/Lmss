// file: useUserAnalytics.ts
import axios from "axios";

export interface UserProfileData {
  uid: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

export const getUserAnalyticsData = async (
  userIds: string[]
): Promise<UserProfileData[]> => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  
  try {
    const response = await axios.post(
      `${backendUrl}/api/lecturer/listCourseUsers`,
      { userIds }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data", error);
    return [];
  }
};
