import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { usePropertyForm } from "@/features/addProperties/usePropertyForm";
function PropertyType() {
  const { form } = usePropertyForm();

  return (
    <FormField
      control={form.control}
      name="propertyType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Property Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="duplex">Duplex</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="shop">Shop/Retail</SelectItem>
              <SelectItem value="office">Office Space</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="industrial">Industrial Property</SelectItem>
              <SelectItem value="petrol-station">Petrol Station</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="farm">Farm</SelectItem>
              <SelectItem value="parking">Parking Space</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default PropertyType;
