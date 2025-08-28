import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  MdOutlineSpaceDashboard,
  MdAddBox,
  MdHouse,
  MdAccountCircle,
} from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";
import { Logout } from "@/authentication/Logout";

interface MenuItem {
  title: string;
  icon: IconType;
}
const items: MenuItem[] = [
  {
    title: "Dashboard",
    icon: MdOutlineSpaceDashboard,
  },
  {
    title: "Add Properties",
    icon: MdAddBox,
  },
  {
    title: "Properties",
    icon: MdHouse,
  },
  {
    title: "Account Managment",
    icon: MdAccountCircle,
  },
  {
    title: "Messages",
    icon: BiMessageSquareDetail,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4 border-b border-blue-700">
          <SidebarGroupLabel>LOGO</SidebarGroupLabel>
        </div>
        <SidebarMenu>
          {items.map((item) => (
            <nav className="flex-1 overflow-y-auto py-2">
              <ul className="space-y-1 px-4">
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      key={item.title}
                      to={`/${item.title.toLowerCase().replace(/\s+/g, "")}`}
                    >
                      <item.icon />
                      <span className=" text-base font-medium ">
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </ul>
            </nav>
          ))}
          <SidebarMenuItem className="relative">
            <div className="flex-1">
              <div className="absolute top-60 left-0 right-0 p-4 border-t border-blue-700">
                <SidebarMenuButton asChild>
                  <Logout />
                </SidebarMenuButton>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
