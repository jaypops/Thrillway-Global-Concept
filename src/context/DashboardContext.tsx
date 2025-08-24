import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { DashboardContextType, DashboardData } from "@/services/type";
import { useProperty } from "@/features/useProperty";

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: propertyData, isPending: propertyLoading } = useProperty();

  useEffect(() => {
    if (propertyData && !propertyLoading) {
      const processedData = processPropertiesData(propertyData);
      setDashboardData(processedData);
      setIsLoading(false);
    }
  }, [propertyData, propertyLoading]);

  const totalProperties = propertyData?.length ?? 0;
  const totalRevenue = propertyData?.reduce((sum, item) => sum + Number(item.price || 0), 0) ?? 0;
  const propertiesSold = propertyData?.filter((item) => item.status === "sold").length ?? 0;
  const propertiesPending = propertyData?.filter((item) => item.status === "pending").length ?? 0;

  return (
    <DashboardContext.Provider
      value={{
        data: dashboardData,
        selectedTimeframe,
        setSelectedTimeframe,
        isLoading: isLoading || propertyLoading,
        propertiesSold,
        totalRevenue,
        totalProperties,
        propertiesPending
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

function processPropertiesData(properties: any[]): DashboardData {
  const propertyStatsMap = new Map<string, {count:number, totalrevenue: number}>();
  const monthlyData = new Map<string, {properties: number, revenue:number}>();
  const monthName = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

 properties.forEach(property => {
    const date = new Date(property.createdAt?.$date?.$numberLong ? 
      parseInt(property.createdAt.$date.$numberLong) : property.createdAt);
    // const year = date.getFullYear();
    const month = date.getMonth();
    const monthKey = `${monthName[month]}`;
    
    if (!propertyStatsMap.has(property.propertyType)) {
      propertyStatsMap.set(property.propertyType, { count: 0, totalrevenue: 0 });
    }
    const typeStats = propertyStatsMap.get(property.propertyType)!;
    typeStats.count += 1;
    typeStats.totalrevenue += Number(property.price || 0);
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { properties: 0, revenue: 0 });
    }
    const monthStats = monthlyData.get(monthKey)!;
    monthStats.properties += 1;
    monthStats.revenue += Number(property.price || 0);
  });

  const propertyStats = Array.from(propertyStatsMap.entries()).map(([type, data]) => ({
    type,
    count: data.count,
    revenue: data.totalrevenue,
    averagePrice: Math.round(data.totalrevenue / data.count)
  }));

  const monthlyTrends = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      properties: data.properties,
      revenue: data.revenue
    }))
    .sort((a, b) => monthName.indexOf(a.month) - monthName.indexOf(b.month));

  return {
    propertyStats,
    monthlyTrends
  };
}