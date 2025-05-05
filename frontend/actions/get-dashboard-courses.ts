import { db } from "@/lib/db";
import { category, Chapter, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
  isEnrolled: boolean;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
  allCourses: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    // Get all courses with their category and published chapters
    const allCourses = await db.course.findMany({
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    // Get user's enrolled courses
    const userEnrollments = await db.enrolled.findMany({
      where: {
        userId: userId,
      },
      select: {
        courseId: true,
      },
    });

    const enrolledCourseIds = userEnrollments.map(
      (enrollment) => enrollment.courseId
    );

    // Map through all courses and add enrollment status and progress
    const coursesWithProgress = await Promise.all(
      allCourses.map(async (course) => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        let progress = null;

        if (isEnrolled) {
          progress = await getProgress(userId, course.id);
        }

        return {
          ...course,
          progress,
          isEnrolled,
        } as CourseWithProgressWithCategory;
      })
    );

    // Filter enrolled courses only for dashboard sections
    const enrolledCourses = coursesWithProgress.filter(
      (course) => course.isEnrolled
    );

    const completedCourses = enrolledCourses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = enrolledCourses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
      allCourses: coursesWithProgress,
    };
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
      allCourses: [],
    };
  }
};
