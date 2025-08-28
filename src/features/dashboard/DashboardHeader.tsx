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
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const { selectedTimeframe, setSelectedTimeframe } = useDashboard();
  const navigate = useNavigate();
  return (
    <div className=" flex-col sm:flex-row flex items-center justify-between pb-6">
      <div className="pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Thrillway Global Concept Dashboard
        </h1>
        <p className="text-sm sm:text-muted-foreground">
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
        <Button size="lg" className="text-sm sm:w-full md:w-auto cursor-pointer text-primary-foreground" onClick={() => navigate("/addproperties")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>
    </div>
  );
}
