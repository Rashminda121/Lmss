import { db } from "@/lib/db";

export const getData = async (userId: string) => {
  try {
    const courses = await db.course.findMany({
      where: { userId },
      select: { id: true, title: true },
    });

    const data = await Promise.all(
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

    const userData = await Promise.all(
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
    );

    const chapterData = await Promise.all(
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
    );

    const userProgressData = await Promise.all(
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
            const userProgress = await db.userprogress.findMany({
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
    );

    const flattenedUserProgressData = userProgressData.flat();

    const flattenedChapterData = chapterData.flat();

    const flattenedUserData = userData.flat();

    const totalEnrollments = data.reduce((acc, curr) => acc + curr.total, 0);

    return {
      data,
      flattenedUserData,
      flattenedChapterData,
      flattenedUserProgressData,
      totalEnrollments,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      flattenedUserData: [],
      flattenedChapterData: [],
      flattenedUserProgressData: [],
      totalEnrollments: 0,
    };
  }
};
