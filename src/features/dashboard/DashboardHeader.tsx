import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/context/DashboardContext";
import { CalendarDays, Plus } from "lucide-react";

export function DashboardHeader() {
  const { selectedTimeframe, setSelectedTimeframe } = useDashboard();

  return (
    <div className="flex items-center justify-between pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Thrillway Global Concept Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your property portfolio and market performance
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Select
          value={selectedTimeframe}
          onValueChange={(value: "weekly" | "monthly" | "yearly") =>
            setSelectedTimeframe(value)
          }
        >
          <SelectTrigger className="w-32">
            <CalendarDays className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        <Button size="lg" className="w-full md:w-auto cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>
    </div>
  );
}
