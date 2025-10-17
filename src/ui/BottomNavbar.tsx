import {
  MdOutlineSpaceDashboard,
  MdAddBox,
  MdHouse,
  MdAccountCircle,
} from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";

interface MenuItem {
  icon: IconType;
  path: string;
  id: number;
}

const items: MenuItem[] = [
  { icon: MdOutlineSpaceDashboard, path: "/dashboard", id: 1 },
  { icon: MdAddBox, path: "/addproperties", id: 2 },
  { icon: MdHouse, path: "/properties", id: 3 },
  { icon: BiMessageSquareDetail, path: "/messages", id: 4 },
  { icon: MdAccountCircle, path: "/accountmanagment", id: 5 },
];

export default function BottomNavbar() {
  return (
    <footer className="fixed bottom-0 left-0 w-full  bg-white/80 backdrop-blur-lg border-t border-gray-200 dark:bg-gray-900/80 dark:border-gray-700 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center py-3 px-4">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center text-xl transition-all duration-300 ease-in-out ${
                isActive
                  ? "text-blue-600 scale-110 after:absolute after:bottom-0 after:w-1 after:h-1 after:rounded-full after:bg-blue-600"
                  : "text-gray-500 hover:text-blue-400 hover:scale-105"
              }`
            }
          >
            <item.icon />
          </NavLink>
        ))}
      </div>
    </footer>
  );
}
