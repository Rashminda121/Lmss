import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface DashbordItemProps {
  icon: LucideIcon;
  name: string;
  href: string;
}

const DashboardCard = ({ icon: Icon, name, href }: DashbordItemProps) => {
  return (
    <Link href={href} className="cursor-pointer">
      <div className="w-64 h-48 md:w-72 md:h-48 p-5 bg-white border border-gray-200 rounded-2xl shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-full mb-4">
          <Icon size={28} className="text-sky-700 dark:text-sky-300" />
        </div>

        {/* Title */}
        <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
          {name}
        </h5>

        {/* View Button */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
            View
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DashboardCard;
