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
      {/* Mobile: swipeable row */}
      <div className="flex gap-4 overflow-x-auto pb-2 pt-20 md:hidden">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="min-w-[250px] flex-shrink-0"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
