import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="flex flex-row p-6 gap-2 items-center">
        <Logo /> <p className="text-sm font-semibold text-blue-800">Lumina</p>
      </div>
      <div className="flex flex-col pt-[6px] w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
