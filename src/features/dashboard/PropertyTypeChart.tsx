import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useProperty } from "../useProperty";
import Loader from "@/ui/Loader";

const chartConfig = {
  count: {
    label: "Properties",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PropertyTypeChart() {
  const { data } = useDashboard();
  const { isPending, error, data: propertyData } = useProperty();
  
  const chartData =
    data?.propertyStats
      ?.map((stat) => ({
        type:
          propertyData?.find((p) => p.propertyType === stat.type)
            ?.propertyType || stat.type,
        count: stat.count,
      }))
      .sort((a, b) => b.count - a.count) || [];

  if (isPending)
    return (
      <div className="p-4">
        <Loader />
      </div>
    );

  if (error) {
    console.error("Error loading properties:", error);
    return <div className="p-4 text-red-500">Failed to load properties.</div>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Distribution</CardTitle>
        <CardDescription>Number of properties by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="type"
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#3B82F6" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
