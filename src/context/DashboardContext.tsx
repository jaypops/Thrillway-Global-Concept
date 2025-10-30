import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { DashboardContextType, DashboardData } from "@/services/type";
import { useProperty } from "@/features/useProperty";

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: propertyData, isPending: propertyLoading } = useProperty();

  const filteredProperties = useMemo(() => {
    if (!propertyData) return [];

    const now = new Date();
    const currentYear = now.getFullYear();

    return propertyData.filter(property => {
     const date = new Date((property as any).createdAt);

      if (selectedTimeframe === "weekly") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo;
      } else if (selectedTimeframe === "monthly") {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return date >= monthAgo;
      } else if (selectedTimeframe === "yearly") {
        return date.getFullYear() === currentYear;
      }
      return true;
    });
  }, [propertyData, selectedTimeframe]);

  useEffect(() => {
    if (propertyData && !propertyLoading) {
      const processedData = processPropertiesData(filteredProperties, selectedTimeframe);
      setDashboardData(processedData);
      setIsLoading(false);
    }
  }, [filteredProperties, propertyLoading, selectedTimeframe, propertyData]);

  const totalProperties = filteredProperties?.length ?? 0;
  const totalRevenue = filteredProperties?.reduce((sum, item) => sum + Number(item.price || 0), 0) ?? 0;
  const propertiesSold = filteredProperties?.filter((item) => item.status === "sold").length ?? 0;
  const propertiesPending = filteredProperties?.filter((item) => item.status === "pending").length ?? 0;

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

function processPropertiesData(properties: any[], timeframe: "weekly" | "monthly" | "yearly"): DashboardData {
  const propertyStatsMap = new Map<string, {count:number, totalrevenue: number}>();
  const timeData = new Map<string, {properties: number, revenue:number}>();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  properties.forEach(property => {
    const date = new Date(property.createdAt?.$date?.$numberLong ? 
      parseInt(property.createdAt.$date.$numberLong) : property.createdAt);
    
    let timeKey: string;
    
    if (timeframe === "weekly") {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      timeKey = dayNames[date.getDay()];
    } else if (timeframe === "monthly") {
      const weekOfMonth = Math.ceil(date.getDate() / 7);
      timeKey = `Week ${weekOfMonth}`;
    } else {
      timeKey = monthNames[date.getMonth()];
    }
    
    if (!propertyStatsMap.has(property.propertyType)) {
      propertyStatsMap.set(property.propertyType, { count: 0, totalrevenue: 0 });
    }
    const typeStats = propertyStatsMap.get(property.propertyType)!;
    typeStats.count += 1;
    typeStats.totalrevenue += Number(property.price || 0);
    
    if (!timeData.has(timeKey)) {
      timeData.set(timeKey, { properties: 0, revenue: 0 });
    }
    const timeStats = timeData.get(timeKey)!;
    timeStats.properties += 1;
    timeStats.revenue += Number(property.price || 0);
  });

  const propertyStats = Array.from(propertyStatsMap.entries()).map(([type, data]) => ({
    type,
    count: data.count,
    revenue: data.totalrevenue,
    averagePrice: data.count > 0 ? Math.round(data.totalrevenue / data.count) : 0
  }));

  let monthlyTrends;
  if (timeframe === "weekly") {
    const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    monthlyTrends = Array.from(timeData.entries())
      .map(([period, data]) => ({
        month: period,
        properties: data.properties,
        revenue: data.revenue
      }))
      .sort((a, b) => dayOrder.indexOf(a.month) - dayOrder.indexOf(b.month));
  } else if (timeframe === "monthly") {
    monthlyTrends = Array.from(timeData.entries())
      .map(([period, data]) => ({
        month: period,
        properties: data.properties,
        revenue: data.revenue
      }))
      .sort((a, b) => {
        const weekA = parseInt(a.month.split(' ')[1]);
        const weekB = parseInt(b.month.split(' ')[1]);
        return weekA - weekB;
      });
  } else {
    monthlyTrends = Array.from(timeData.entries())
      .map(([period, data]) => ({
        month: period,
        properties: data.properties,
        revenue: data.revenue
      }))
      .sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month));
  }

  return {
    propertyStats,
    monthlyTrends
  };
}