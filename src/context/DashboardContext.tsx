import { DashboardContextType, DashboardData } from "@/services/type";
import { createContext, useContext, useState, type ReactNode } from "react";

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// Mock data
const mockData: DashboardData = {
  totalProperties: 1247,
  totalRevenue: 45600000,
  averagePrice: 850000,
  propertiesSold: 89,
  propertyStats: [
    { type: "house", count: 245, revenue: 15600000, averagePrice: 950000 },
    { type: "apartment", count: 189, revenue: 8900000, averagePrice: 650000 },
    { type: "land", count: 156, revenue: 7800000, averagePrice: 450000 },
    { type: "duplex", count: 98, revenue: 6200000, averagePrice: 1200000 },
    { type: "office-space", count: 87, revenue: 4300000, averagePrice: 780000 },
    { type: "shop", count: 76, revenue: 2100000, averagePrice: 320000 },
    { type: "warehouse", count: 54, revenue: 1800000, averagePrice: 890000 },
    {
      type: "industrial-property",
      count: 43,
      revenue: 1600000,
      averagePrice: 1100000,
    },
    { type: "restaurant", count: 32, revenue: 980000, averagePrice: 420000 },
    { type: "hotel", count: 21, revenue: 1200000, averagePrice: 2100000 },
    { type: "parking-space", count: 67, revenue: 340000, averagePrice: 85000 },
    { type: "farm", count: 29, revenue: 1450000, averagePrice: 680000 },
  ],
  monthlyTrends: [
    { month: "Jul", properties: 89, revenue: 3200000 },
    { month: "Aug", properties: 95, revenue: 3800000 },
    { month: "Sep", properties: 102, revenue: 4100000 },
    { month: "Oct", properties: 87, revenue: 3600000 },
    { month: "Nov", properties: 112, revenue: 4500000 },
    { month: "Dec", properties: 98, revenue: 3900000 },
    { month: "Jan", properties: 125, revenue: 5200000 },
  ],
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data] = useState<DashboardData>(mockData);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "weekly" | "monthly" | "yearly"
  >("monthly");
  const [isLoading] = useState(false);

  return (
    <DashboardContext.Provider
      value={{
        data,
        selectedTimeframe,
        setSelectedTimeframe,
        isLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
