import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import { getData } from "@/actions/get-dashboard-data";
import { getUserDashBoardData } from "@/actions/get-admin-dashboard-data";
import { getUserAnalyticsData } from "@/actions/userData";
import { FiBook, FiUsers, FiBookOpen, FiAward } from "react-icons/fi";
import axios from "axios";

interface UserCompletedData {
  userId: string;
  courseId: string;
  courseTitle: string;
  completedChapterCount: number;
}

interface UserProfileData {
  uid: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

interface CombinedData extends UserCompletedData {
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  if (!backendUrl) {
    console.error("Backend URL is not defined.");
    return;
  }

  const response = await axios.get(
    `${backendUrl}/user/userProfile?uid=${userId}`
  );
  const userDetails = response.data;

  const {
    data,
    totalEnrollments,
    flattenedChapterData,
    flattenedUserProgressData,
  } = await getData(userId);

  const {
    chartData,
    adminFlattenedChapterData,
    adminFlattenedUserProgressData,
    adminTotalEnrollments,
  } = await getUserDashBoardData();

  const courseCount =
    userDetails?.role === "admin" ? chartData.length : data.length;

  const chapterCount =
    userDetails?.role === "admin"
      ? adminFlattenedChapterData.length
      : flattenedChapterData.length;

  const userCompletedCount = flattenedUserProgressData
    .filter((progress) => progress.isCompleted)
    .reduce((acc, progress) => {
      const key = `${progress.userId}-${progress.courseId}`;

      if (!acc[key]) {
        acc[key] = {
          userId: progress.userId,
          courseId: progress.courseId,
          courseTitle: progress.courseTitle || "",
          completedChapterCount: 0,
        };
      }

      acc[key].completedChapterCount += 1;

      return acc;
    }, {} as Record<string, { userId: string; courseId: string; courseTitle: string; completedChapterCount: number }>);

  const adminUserCompletedCount = adminFlattenedUserProgressData
    .filter((progress) => progress.isCompleted)
    .reduce((acc, progress) => {
      const key = `${progress.userId}-${progress.courseId}`;

      if (!acc[key]) {
        acc[key] = {
          userId: progress.userId,
          courseId: progress.courseId,
          courseTitle: progress.courseTitle || "",
          completedChapterCount: 0,
        };
      }

      acc[key].completedChapterCount += 1;

      return acc;
    }, {} as Record<string, { userId: string; courseId: string; courseTitle: string; completedChapterCount: number }>);

  const userCompletedCountsArray =
    userDetails?.role === "admin"
      ? Object.values(adminUserCompletedCount)
      : Object.values(userCompletedCount);

  const userIds: string[] = [];

  userCompletedCountsArray.forEach((item) => {
    if (!userIds.includes(item.userId)) {
      userIds.push(item.userId);
    }
  });

  const userAnalyticsData = await getUserAnalyticsData(userIds);

  const mergeUserAnalyticsData = (
    userCompletedCountsArray: UserCompletedData[],
    userAnalyticsData: UserProfileData[]
  ): CombinedData[] => {
    return userCompletedCountsArray.map((userProgress) => {
      const userProfile = userAnalyticsData.find(
        (user) => user.uid === userProgress.userId
      );

      return {
        ...userProgress,
        name: userProfile?.name,
        email: userProfile?.email,
        image: userProfile?.image,
        role: userProfile?.role,
      };
    });
  };

  const combinedData = mergeUserAnalyticsData(
    userCompletedCountsArray,
    userAnalyticsData
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        Analytics Dashboard
        {userDetails?.role &&
          `- ${userDetails.role
            .charAt(0)
            .toUpperCase()}${userDetails.role.slice(1)} View`}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard label="Total Courses" value={courseCount} icon={FiBook} />
        <DataCard
          label="Total Enrollments"
          value={
            userDetails?.role === "admin"
              ? adminTotalEnrollments
              : totalEnrollments ?? 0
          }
          icon={FiUsers}
        />
        <DataCard
          label="Total Chapters"
          value={chapterCount ?? 0}
          icon={FiBookOpen}
        />
        <DataCard
          label="Active Learners"
          value={userIds.length ?? 0}
          icon={FiAward}
        />
      </div>

      {/* <div>{JSON.stringify(userDetails, null, 2)}</div> */}

      {/* Chart Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Enrollment Overview
        </h2>
        <div className="h-80">
          <Chart data={data} />
        </div>
      </div>

      {/* User Progress Table */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          User Progress
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chapters Completed
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {combinedData.map((cdata, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    <div className="max-w-[200px] max-h-[60px] overflow-y-auto break-words">
                      {cdata.courseTitle}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {cdata.completedChapterCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={cdata.image || "/default-avatar.png"}
                          alt="User profile"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {cdata.name || "Anonymous"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {cdata.email || "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cdata.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : cdata.role === "teacher"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {cdata.role || "student"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {combinedData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No user progress data available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
