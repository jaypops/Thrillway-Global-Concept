import { useFormContext, Controller } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyFormValues } from "./propertySchema";

const features = [
  { name: "swimmingPool", label: "Swimming Pool" },
  { name: "garage", label: "Garage" },
  { name: "balcony", label: "Balcony" },
  { name: "security", label: "Security" },
  { name: "garden", label: "Garden" },
  { name: "airConditioning", label: "Air Conditioning" },
  { name: "furnished", label: "Furnished" },
  { name: "parking", label: "Parking" },
] as const;

export const PropertyFeatures = () => {
  const { control } = useFormContext<PropertyFormValues>();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {features.map((feature) => (
        <Controller
          key={feature.name}
          control={control}
          name={`features.${feature.name}`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">{feature.label}</FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};