import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapterDetails = async ({
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const chapterDetails = await db.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        title: true,
        description: true,
      },
    });

    const courseDetails = await db.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        title: true,
        description: true,
      },
    });

    if (!chapterDetails || !courseDetails) {
      throw new Error("Chapter or course not found");
    }

    return {
      chapterDetails,
      courseDetails,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapterDetails: null,
      courseDetails: null,
    };
  }
};
