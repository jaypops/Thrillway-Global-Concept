import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FileUploader } from "@/features/addProperties/FileUploader";
import { PropertyFeatures } from "@/features/addProperties/PropertyFeatures";
import { usePropertyForm } from "@/features/addProperties/usePropertyForm";
import { Switch } from "@/components/ui/switch";
import { Property } from "@/services/type";
import Loader2 from "@/ui/Loader2";

interface CreatePropertyFormProps {
  isEditMode?: boolean;
  initialValues?: Property;
  onSuccess?: () => void;
  id: string;
}

function CreatePropertyForm({
  isEditMode = false,
  initialValues,
  onSuccess,
  id,
}: CreatePropertyFormProps) {
  const {
    form,
    images,
    documents,
    imagePreviewUrls,
    documentPreviewUrls,
    handleImageUpload,
    handleDocumentUpload,
    removeImage,
    removeDocument,
    onSubmit,
    isLoading,
  } = usePropertyForm({
    id,
    isEditMode,
    initialValues,
    onSuccess,
  });

  const propertyType = form.watch("propertyType");
  const isNonResidential =
    propertyType &&
    [
      "land",
      "warehouse",
      "industrial",
      "petrol-station",
      "parking",
      "restaurant",
    ].includes(propertyType);
  const isOfficeOrShop = propertyType === "office" || propertyType === "shop";
  return (
    <div>
      <Form {...form}>
        <form
          className="space-y-8"
          onSubmit={form.handleSubmit((data) => {
            onSubmit(data);
          })}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="text-xs xs:text-lg"
                        placeholder="Luxury 3-Bedroom Apartment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={isLoading}
                          className="text-xs xs:text-lg"
                          placeholder="250000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Classification</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer text-xs lg:text-base">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="asking">Asking Price</SelectItem>
                          <SelectItem value="negotiable">Negotiable</SelectItem>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                          <SelectItem value="starting-bid">
                            Starting Bid
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lagos..."
                        className="text-xs xs:text-lg"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer text-xs lg:text-base">
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
                          <SelectItem value="industrial">
                            Industrial Property
                          </SelectItem>
                          <SelectItem value="petrol-station">
                            Petrol Station
                          </SelectItem>
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

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statues</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full cursor-pointer text-xs lg:text-base">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="avaliable">Available</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isNonResidential && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isOfficeOrShop ? "Units" : "Rooms"}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full cursor-pointer text-xs xs:text-lg">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, "5+"].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full cursor-pointer text-xs lg:text-base">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, "5+"].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="propertySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Size (sq m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="120"
                        className="text-xs xs:text-lg"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the property..."
                        className="min-h-[150px] text-xs xs:text-lg"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ fieldState }) => (
                  <FileUploader
                    id="image-upload"
                    label="Upload Images *"
                    description="PNG, JPG, GIF up to 10MB"
                    accept="image/*"
                    files={images}
                    previewUrls={imagePreviewUrls}
                    onFileChange={handleImageUpload}
                    onRemove={removeImage}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="documents"
                render={({ fieldState }) => (
                  <FileUploader
                    id="document-upload"
                    label="Upload Documents"
                    description="PDF, DOC up to 10MB"
                    accept=".pdf,.doc,.docx"
                    previewUrls={documentPreviewUrls}
                    files={documents}
                    onFileChange={handleDocumentUpload}
                    onRemove={removeDocument}
                    icon={<FileText className="h-6 w-6 mb-2" />}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Additional Features</h3>
            <PropertyFeatures />
          </div>

          <Separator />
          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Property Availability
                  </FormLabel>
                  <FormDescription>
                    Set whether this property is currently available on the
                    market
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    className="cursor-pointer"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto cursor-pointer"
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? (
              <>
                <Loader2 />
                Submitting...
              </>
            ) : isEditMode ? (
              "Update Property"
            ) : (
              "Upload Property"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreatePropertyForm;
