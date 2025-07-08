import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useDashboard } from "@/context/DashboardContext"


const chartConfig = {
  count: {
    label: "Properties",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const propertyTypeLabels = {
  house: "House",
  apartment: "Apartment",
  land: "Land",
  duplex: "Duplex",
  "office-space": "Office Space",
  shop: "Shop",
  warehouse: "Warehouse",
  "industrial-property": "Industrial",
  restaurant: "Restaurant",
  hotel: "Hotel",
  "parking-space": "Parking",
  farm: "Farm",
}

export function PropertyTypeChart() {
  const { data } = useDashboard()

  const chartData = data.propertyStats
    .map((stat) => ({
      type: propertyTypeLabels[stat.type],
      count: stat.count,
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Distribution</CardTitle>
        <CardDescription>Number of properties by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} fontSize={12} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
