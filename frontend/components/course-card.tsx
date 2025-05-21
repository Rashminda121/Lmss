"use client";
import Link from "next/link";
import Image from "next/image";
import { IconBadge } from "@/components/icon-badge";
import { BookOpen, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/course-progress";
import Swal from "sweetalert2";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
  enrolled?: boolean;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  enrolled,
}: CourseCardProps) => {
  const { user } = useUser();

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const handleOnClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will be unenrolled from this course. You can always re-enroll later if you change your mind!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, unenroll me!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `${backendUrl}/user/unEnrollCourse`,
          {
            data: { userId: user?.id, courseId: id },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "You have been unenrolled from the course.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          showClass: {
            popup: "animate__animated animate__bounceInDown",
          },
          hideClass: {
            popup: "animate__animated animate__bounceOutUp",
          },
        });
        window.location.replace(window.location.pathname);
      }
    } catch (error: any) {
      console.error("Failed to delete discussion:", error);

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Unable to unenroll from the course. Please try again later.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: "animate__animated animate__bounceInDown",
        },
        hideClass: {
          popup: "animate__animated animate__bounceOutUp",
        },
      });
    }
  };

  return (
    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full flex flex-col">
      <Link href={`/courses/${id}`} className="flex-grow">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-contain" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="pt-[5px] text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength}
                {chaptersLength === 1 ? " Chapter" : " Chapters"}
              </span>
            </div>
          </div>
          {progress !== null && (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          )}
        </div>
      </Link>

      {enrolled && (
        <button
          onClick={() => handleOnClick()}
          className="mt-3 w-full py-2 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          <span>Unenroll</span>
        </button>
      )}
    </div>
  );
};
