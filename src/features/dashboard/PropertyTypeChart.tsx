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
import FilterData from "./FilterData";

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
    <Card className="shadow-md">
      <CardHeader className="space-y-1 sm:space-y-2 pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-base sm:text-lg max-w-[100px] sm:max-w-full">
            Property Distribution
          </CardTitle>
          <div>
            <FilterData />
          </div>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Number of properties by type
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-4 pt-0">
        <ChartContainer
          config={chartConfig}
          className="min-h-[240px] sm:min-h-[300px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="type"
              angle={-45}
              textAnchor="end"
              height={55}
              fontSize={10}
              interval={0}
            />
            <YAxis fontSize={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#3B82F6" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
