import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useDashboard } from "@/context/DashboardContext"

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
  const { data } = useDashboard();

  const chartData = data.monthlyTrends.map((trend) => ({
    ...trend,
    revenueInMillions: trend.revenue / 1000000,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue & Sales Trends</CardTitle>
        <CardDescription>
          Monthly performance over the last 7 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
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
