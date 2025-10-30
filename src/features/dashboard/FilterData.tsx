import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon, Check } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function FilterData() {
  const { selectedTimeframe, setSelectedTimeframe } = useDashboard();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 ml-2">
          <FilterIcon className="h-4 w-4" />
          Filter: {selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Select Filter</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => setSelectedTimeframe("weekly")}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm">Weekly</span>
            {selectedTimeframe === "weekly" && (
              <Check className="h-4 w-4" />
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => setSelectedTimeframe("monthly")}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm">Monthly</span>
            {selectedTimeframe === "monthly" && (
              <Check className="h-4 w-4" />
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => setSelectedTimeframe("yearly")}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm">Yearly</span>
            {selectedTimeframe === "yearly" && (
              <Check className="h-4 w-4" />
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}