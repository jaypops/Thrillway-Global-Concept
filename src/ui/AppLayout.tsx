import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Toaster } from "react-hot-toast";
import Header from "./Header";
import BottomNavbar from "./BottomNavbar";

function AppLayout() {
  return (
    <div className="w-full bg-sky-50 min-h-screen">
      <Header />

      <div className="flex items-center justify-center z-20">
        <div className="fixed left-0 top-20 h-screen  hidden md:block">
          <Sidebar />
        </div>

        <main className="ml-0 md:ml-60 flex-1 overflow-y-auto pl-0 md:pl-6 pb-15 md:pb-0">
          <Toaster position="top-center" />
          <Outlet />
        </main>
      </div>

      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
}

export default AppLayout;
