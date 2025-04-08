import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFormContext } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { fetchLocation } from "@/services/apiautocomplete";

interface LocationSuggestion {
  display_name: string;
}

 function Location() {
  const { control, setValue, setError, watch, formState } = useFormContext();
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const locationValue = watch("location");

  const debounce = useCallback(
    (func: (...args: any[]) => void, delay: number) => {
      let timer: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
      };
    },
    []
  );

  const fetchSuggestions = async (value: string) => {
    if (isRateLimited) return;

    try {
      const result = await fetchLocation(value);
      setSuggestions(result);
      setNoResults(result.length === 0);
      setError("location", { message: "" });
    } catch (err) {
      console.error("API Error:", err);
      setIsRateLimited(true);
      setTimeout(() => setIsRateLimited(false), 60000);
      setError("location", {
        type: "manual",
        message: "Too many requests. Please enter manually",
      });
    }
  };

  const debouncedFetch = useCallback(debounce(fetchSuggestions, 500), [
    isRateLimited,
  ]);

  const handleInputChange = (value: string) => {
    setValue("location", value, { shouldValidate: true });
    if (value.length > 2) {
      debouncedFetch(value);
    } else {
      setSuggestions([]);
      setNoResults(false);
    }
  };

  const handleSelectSuggestion = (place: string) => {
    setValue("location", place, { shouldValidate: true });
    setSuggestions([]);
    setNoResults(false);
  };

  useEffect(() => {
    return () => {
      setSuggestions([]);
    };
  }, []);

  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>Location</FormLabel>
          <FormControl>
            <Command shouldFilter={false}>
              <CommandInput
                {...field}
                placeholder="Enter location..."
                value={locationValue || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleInputChange(value);
                }}
              />
              {(noResults || suggestions.length > 0) && (
                <CommandList className="absolute z-10 w-full mt-1 bg-popover shadow-lg rounded-md border">
                  {noResults && !formState.errors.location?.message && (
                    <CommandEmpty>No results found.</CommandEmpty>
                  )}
                  {suggestions.length > 0 && (
                    <CommandGroup heading="Suggestions">
                      {suggestions.map((place, index) => (
                        <CommandItem
                          key={`${place.display_name}-${index}`}
                          value={place.display_name}
                          onSelect={() => handleSelectSuggestion(place.display_name)}
                          className="cursor-pointer"
                        >
                          {place.display_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              )}
            </Command>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default Location;