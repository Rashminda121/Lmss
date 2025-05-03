import { db } from "@/lib/db";
import axios from "axios";

export interface UserProfileData {
  uid: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

export interface CombinedData {
  name: string;
  total: number;
}

const getUserDashBoardData = async () => {
  try {
    const courses = await db.course.findMany({
      select: { id: true, title: true },
    });

    // Total enrolled per course
    const chartData: CombinedData[] = await Promise.all(
      courses.map(async (course) => {
        const count = await db.enrolled.count({
          where: { courseId: course.id },
        });

        return {
          name: course.title,
          total: count,
        };
      })
    );

    // Get user enrollments
    const userData = (
      await Promise.all(
        courses.map(async (course) => {
          const enrolledUsers = await db.enrolled.findMany({
            where: { courseId: course.id },
            select: {
              userId: true,
              userName: true,
            },
          });

          return enrolledUsers.map((enrollment) => ({
            name: course.title,
            courseId: course.id,
            userId: enrollment.userId,
          }));
        })
      )
    ).flat();

    // Get chapter data per course
    const chapterData = (
      await Promise.all(
        courses.map(async (course) => {
          const chapters = await db.chapter.findMany({
            where: { courseId: course.id },
            select: {
              id: true,
              title: true,
            },
          });

          return chapters.map((chapter) => ({
            courseId: course.id,
            courseTitle: course.title,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
          }));
        })
      )
    ).flat();

    // User progress per chapter
    const userProgressData = (
      await Promise.all(
        courses.map(async (course) => {
          const chapters = await db.chapter.findMany({
            where: { courseId: course.id },
            select: {
              id: true,
              title: true,
            },
          });

          const progressDetails = await Promise.all(
            chapters.map(async (chapter) => {
              const userProgress = await db.userProgress.findMany({
                where: {
                  chapterId: chapter.id,
                },
                select: {
                  userId: true,
                  isCompleted: true,
                },
              });

              return userProgress.map((progress) => ({
                courseId: course.id,
                courseTitle: course.title,
                chapterId: chapter.id,
                chapterTitle: chapter.title,
                userId: progress.userId,
                isCompleted: progress.isCompleted,
              }));
            })
          );

          return progressDetails.flat();
        })
      )
    ).flat();

    const adminTotalEnrollments = chartData.reduce(
      (acc, curr) => acc + curr.total,
      0
    );

    return {
      chartData,
      adminFlattenedUserData: userData,
      adminFlattenedChapterData: chapterData,
      adminFlattenedUserProgressData: userProgressData,
      adminTotalEnrollments,
    };
  } catch (error) {
    console.error("[GET_ANALYTICS]", error);
    return {
      chartData: [],
      adminFlattenedUserData: [],
      adminFlattenedChapterData: [],
      adminFlattenedUserProgressData: [],
      adminTotalEnrollments: 0,
    };
  }
};

export { getUserDashBoardData };
