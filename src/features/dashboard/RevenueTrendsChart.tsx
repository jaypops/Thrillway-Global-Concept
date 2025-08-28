import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDashboard } from "@/context/DashboardContext";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
  properties: {
    label: "Properties Sold",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function RevenueTrendsChart() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Sales Trends</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.monthlyTrends.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Sales Trends</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-12">
            No revenue data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.monthlyTrends.map((trend) => ({
    ...trend,
    revenueInMillions: trend.revenue / 1000000,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Sales Trends</CardTitle>
        <CardDescription>Monthly performance overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenueInMillions"
              stroke="var(--color-revenue)"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="properties"
              stroke="var(--color-properties)"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
