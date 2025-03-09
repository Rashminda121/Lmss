"use client";

import { BarChart, Compass, Layout, List, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  const onClick = () => {
    router.push("/mainPage");
  };

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}

      <button
        onClick={onClick}
        className="flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20"
      >
        <div className="flex items-center gap-x-2 py-4">
          <LogOut size={22} className="text-slate-500" />
          <span className="text-sm font-medium text-gray-700">Exit</span>
        </div>
      </button>
    </div>
  );
};
