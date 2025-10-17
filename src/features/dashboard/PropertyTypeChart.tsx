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
      <div className="p-2 sm:p-4">
        <Loader />
      </div>
    );

  if (error) {
    console.error("Error loading properties:", error);
    return (
      <div className="p-2 sm:p-4 text-red-500">Failed to load properties.</div>
    );
  }

  return (
    <Card className="p-1 sm:p-0 shadow-md">
      <div className="pt-6">
        <CardHeader className="space-y-1 sm:space-y-2">
          <CardTitle className="text-base sm:text-lg">
            Property Distribution
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Number of properties by type
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <ChartContainer
            config={chartConfig}
            className="min-h-[280px] sm:min-h-[300px] w-full"
          >
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 3 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="type"
                angle={-45}
                textAnchor="end"
                height={70}
                fontSize={10}
                interval={0}
              />
              <YAxis fontSize={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="#3B82F6" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </div>
    </Card>
  );
}
