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
  title: string;
  icon: IconType;
  path: string;
}

const items: MenuItem[] = [
  { title: "Dashboard", icon: MdOutlineSpaceDashboard, path: "/dashboard" },
  { title: "Add Properties", icon: MdAddBox, path: "/addproperties" },
  { title: "Properties", icon: MdHouse, path: "/properties" },
  {
    title: "Account Managment",
    icon: MdAccountCircle,
    path: "/accountmanagment",
  },
  { title: "Messages", icon: BiMessageSquareDetail, path: "/messages" },
];

export function Sidebar() {

  return (
    <aside className="h-[100vh] w-64 bg-white rounded-3xl shadow-md p-5 flex flex-col justify-between ml-4">
      <div className="">
        {items.map((item) => (
          <nav className="flex-1 overflow-y-auto py-2" key={item.title}>
            <ul className="space-y-1">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md hover:bg-blue-200/20 transition-colors ${
                    isActive
                      ? "bg-blue-100 border-r-[3px] border-blue-400"
                      : "text-[#292933]"
                  }`
                }
              >
                <item.icon />
                <span className="ml-2 text-base font-medium">{item.title}</span>
              </NavLink>
            </ul>
          </nav>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
