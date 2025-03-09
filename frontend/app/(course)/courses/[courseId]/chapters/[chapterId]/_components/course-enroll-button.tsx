"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CourseEnrollButtonProps {
  // price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  // price,
  courseId,
}: CourseEnrollButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      // const response = await axios.post(`/api/courses/${courseId}/checkout`);
      await axios.post(`/api/courses/${courseId}/enroll`);
      toast.success("Successfully enrolled");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto "
    >
      Enroll for the Course
      {/* for {formatPrice(price)} */}
    </Button>
  );
};
