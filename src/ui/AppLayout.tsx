import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Sidebar";
import { Toaster } from "react-hot-toast";

function AppLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="w-full bg-sky-50 min-h-screen p-0 md:pb-6 lg:pb-6">
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
