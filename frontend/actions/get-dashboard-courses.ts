import { db } from "@/lib/db";
import { category, chapter, course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = course & {
  category: category;
  chapters: chapter[];
  progress: number | null;
  isEnrolled: boolean;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
  allCourses: CourseWithProgressWithCategory[];
};

type CourseWithChapters = course & {
  chapters: chapter[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    // Get all courses with their category and published chapters
    const courses = await db.course.findMany({
      where: {
        id: {
          not: "",
        },
      },
    });

    // Step 2: Map each course and attach only published chapters
    const allCourses: CourseWithChapters[] = (
      await Promise.all(
        courses.map(async (course) => {
          const publishedChapters = await db.chapter.findMany({
            where: {
              courseId: course.id,
              isPublished: true,
            },
          });

          if (publishedChapters.length > 0) {
            return {
              ...course,
              chapters: publishedChapters,
            };
          }

          return null;
        })
      )
    ).filter((c): c is CourseWithChapters => c !== null);

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
      (course: any) => course.isEnrolled
    );

    const completedCourses = enrolledCourses.filter(
      (course: any) => course.progress === 100
    );
    const coursesInProgress = enrolledCourses.filter(
      (course: any) => (course.progress ?? 0) < 100
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
