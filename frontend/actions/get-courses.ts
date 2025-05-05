import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    // First get all courses that match the filters
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchase: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get all enrolled courses for the user
    const userEnrollments = await db.enrolled.findMany({
      where: {
        userId: userId,
      },
      select: {
        courseId: true,
      },
    });

    // Filter out courses where the user is enrolled
    const enrolledCourseIds = userEnrollments.map(
      (enrollment) => enrollment.courseId
    );
    const unenrolledCourses = courses.filter(
      (course) =>
        !enrolledCourseIds.includes(course.id) && course.purchase.length === 0
    );

    // For these unenrolled courses, we don't need to calculate progress
    const coursesWithProgress: CourseWithProgressWithCategory[] =
      unenrolledCourses.map((course) => ({
        ...course,
        progress: null, // Progress is null for unenrolled courses
      }));

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
