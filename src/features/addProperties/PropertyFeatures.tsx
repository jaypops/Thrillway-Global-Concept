import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyFormValues } from "./propertySchema";
import { usePropertyForm } from "./usePropertyForm";

export const FEATURES = [
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
  const { isLoading } = usePropertyForm();
  const { control } = useFormContext<PropertyFormValues>();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {FEATURES.map((feature) => (
        <Controller
          key={feature.name}
          control={control}
          name={`features.${feature.name}`}
          defaultValue={false}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  disabled={isLoading}
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                {feature.label}
              </FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};
