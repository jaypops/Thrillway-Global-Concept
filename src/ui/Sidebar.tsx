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
  MdSettings,
  MdAccountCircle,
} from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";

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
  {
    title: "Settings",
    icon: MdSettings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  key={item.title}
                  to={`/${item.title.toLowerCase().replace(/\s+/g, "")}`}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
