import { PropertyTypeChart } from "@/features/dashboard/PropertyTypeChart";
// import { RevenueTrendsChart } from "@/features/dashboard/RevenueTrendsChart";
import { StatsCards } from "@/features/dashboard/StatsCards";

function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto md:px-6 px-3 p-6 space-y-6 pt-21">
        <StatsCards />
        <div className="w-full max-w mx-auto">
          <PropertyTypeChart />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
