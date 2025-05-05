import { category, course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = course & {
  category: category | null;
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
      (course) => !enrolledCourseIds.includes(course.id)
    );

    // Manually fetch categories and chapters for each course
    const coursesWithCategoryAndChapters = await Promise.all(
      unenrolledCourses.map(async (course) => {
        // Fetch category for each course
        const category = await db.category.findUnique({
          where: { id: course.categoryId || "" },
        });

        // Fetch chapters for each course
        const chapters = await db.chapter.findMany({
          where: { courseId: course.id },
          select: { id: true },
        });

        // Return the enriched course data
        return {
          ...course,
          category,
          chapters,
          progress: null, // Progress is null for unenrolled courses
        };
      })
    );

    return coursesWithCategoryAndChapters;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
