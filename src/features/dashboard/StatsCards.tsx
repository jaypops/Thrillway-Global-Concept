"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/context/DashboardContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, CheckCircle, Clock, Wallet } from "lucide-react";

export function StatsCards() {
  const {
    isLoading,
    totalProperties,
    totalRevenue,
    propertiesSold,
    propertiesPending,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="min-w-[250px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Properties",
      value: totalProperties.toLocaleString(),
      icon: Home,
      description: "All properties in portfolio",
    },
    {
      title: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: Wallet,
      description: "Total revenue generated",
    },
    {
      title: "Properties Sold",
      value: propertiesSold.toLocaleString(),
      icon: CheckCircle,
      description: "Successfully sold properties",
    },
    {
      title: "Pending Sales",
      value: (propertiesPending || 0).toLocaleString(),
      icon: Clock,
      description: "Properties awaiting completion",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-full text-blue-600">
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold line-clamp-1">{stat.value}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
