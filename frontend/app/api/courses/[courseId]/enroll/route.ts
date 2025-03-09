import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const enrolled = await db.enrolled.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (enrolled) {
      return new NextResponse("Already enrolled", { status: 400 });
    }

    // Enroll the user
    const enrolledCourse = await db.enrolled.create({
      data: {
        courseId: params.courseId,
        userId: user.id,
        userName: user.fullName || "",
      },
    });

    return NextResponse.json(enrolledCourse);
  } catch (error) {
    console.log("[COURSE_ID_ENROLLED]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
