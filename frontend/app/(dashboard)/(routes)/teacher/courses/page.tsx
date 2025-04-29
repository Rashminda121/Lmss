import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import axios from "axios";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // const res = await axios.get(`${backendUrl}/user/userProfile`, {
  //   params: { uid: userId },
  // });

  // const userProfile = res.data;

  // let courses;

  // if (userProfile?.role === "admin") {
  //   courses = await db.course.findMany({
  //     orderBy: { createdAt: "desc" },
  //   });
  // } else {
  //   courses = await db.course.findMany({
  //     where: { userId },
  //     orderBy: { createdAt: "desc" },
  //   });
  // }

  const courses = await db.course.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return <DataTable columns={columns} data={courses} />;
};

export default CoursesPage;
