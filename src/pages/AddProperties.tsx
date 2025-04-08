import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import PropertyType from "@/ui/PropertyType";
import Location from "@/ui/Location";
import { Switch } from "@/components/ui/switch";

export default function AddProperties() {
  const {
    form,
    images,
    documents,
    imagePreviewUrls,
    isNonResidential,
    isOfficeOrShop,
    handleImageUpload,
    handleDocumentUpload,
    removeImage,
    removeDocument,
    onSubmit,
    isLoading,
  } = usePropertyForm();

  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Property</CardTitle>
        <CardDescription>
          Fill in the details to list a new property
        </CardDescription>
      </CardHeader>
      <div className="p-14">
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit((data) => {
              console.log("Form submitting with:", data);
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
                            placeholder="250000"
                            {...field}
                          />
                        </FormControl>
                        {/* <FormDescription>
                          Enter the price in your local currency
                        </FormDescription> */}
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
                        >
                          <FormControl>
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="asking">Asking Price</SelectItem>
                            <SelectItem value="negotiable">
                              Negotiable
                            </SelectItem>
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

                <Location />

                <PropertyType />

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
                          >
                            <FormControl>
                              <SelectTrigger className="w-full cursor-pointer">
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
                          >
                            <FormControl>
                              <SelectTrigger className="w-full cursor-pointer">
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
                        <Input type="number" placeholder="120" {...field} />
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
                          className="min-h-[150px]"
                          {...field}
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
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              onClick={() => console.log("Manual test", form.getValues())}
              type="submit"
              size="lg"
              className="w-full md:w-auto"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isLoading ? "Uploading..." : "Upload Property"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
