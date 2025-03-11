import { GraduationCap, Bot, MessagesSquare, CalendarDays } from "lucide-react";
import DashboardCard from "../_components/dashboardCards";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const MainPage = () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const dashboardItems = [
    { icon: GraduationCap, name: "Courses", href: "./" },
    { icon: Bot, name: "Assistance", href: "#about" },
    { icon: MessagesSquare, name: "Discussions", href: "#articles" },
    { icon: CalendarDays, name: "Events", href: "#contact" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-2 dark:bg-gray-900">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">
        Main Menu
      </h2>

      {/* Dashboard Cards - Flexbox */}
      <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            icon={item.icon}
            name={item.name}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPage;
