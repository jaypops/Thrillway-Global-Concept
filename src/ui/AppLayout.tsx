import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Sidebar";
import { Toaster } from "react-hot-toast";

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-sky-50 min-h-dvh">
        <Toaster position="top-center" />
        <div className="z-100">
          <SidebarTrigger />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default AppLayout;
