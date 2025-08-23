import { CalendarIcon, Loader2, X } from "lucide-react";
import { format, set } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAccountForm } from "./useAccountForm";
import { useInviteLink } from "@/context/InviteLinkContext";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

interface CreateAccountFormProps {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRole?: React.Dispatch<
    React.SetStateAction<"admin" | "fieldAgent" | "customerAgent" | null>
  >;
  isInvitationFlow?: boolean;
}

function CreateAccountForm({
  setShowForm,
  setSelectedRole,
  isInvitationFlow = false,
}: CreateAccountFormProps) {
  const {
    form,
    onSubmit,
    handleImageUpload,
    isSubmitting,
    isCreating,
    image,
    removeImg,
  } = useAccountForm();

  const { setRole: setInviteRole } = useInviteLink();
  const [searchParams] = useSearchParams();

useEffect(() => {
  if (isInvitationFlow) {
    const role = searchParams.get("role") as
      | "admin"
      | "fieldAgent"
      | "customerAgent";
    if (role) {
      form.setValue("role", role);
      if (setSelectedRole) {
        setSelectedRole(role);
      }
      if (setInviteRole) {
        setInviteRole(role);
      }
    }
  }
}, [searchParams, form, setSelectedRole, isInvitationFlow, setInviteRole]);

const handleRoleChange = (value: string) => {
  const roleValue = value as "admin" | "fieldAgent" | "customerAgent";
  form.setValue("role", roleValue);
  if (setSelectedRole) {
    setSelectedRole(roleValue);
  }
  if (isInvitationFlow && setInviteRole) {
    setInviteRole(roleValue);
  }
};

  const handleSubmit = async (data: any) => {
    try {
      if (isInvitationFlow) {
        const invitationToken = localStorage.getItem("invitationToken");
        if (invitationToken) {
          data.invitationToken = invitationToken;
        }
      }
      await onSubmit(data);
      setShowForm(false);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="px-14 pb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      disabled={isCreating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose a username"
                      disabled={isCreating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      disabled={isCreating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      disabled={isCreating}
                      placeholder="Enter emergency contact number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={isCreating}
                      placeholder="Enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your address"
                      disabled={isCreating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      disabled={isCreating}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isCreating}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value ? "text-muted-foreground" : ""
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isCreating}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      disabled={isCreating}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                          onChange(file);
                        }
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  {(image || value) && (
                    <div className="mt-2 relative group">
                      <img
                        src={
                          image
                            ? URL.createObjectURL(image)
                            : typeof value === "string"
                            ? value
                            : value instanceof File
                            ? URL.createObjectURL(value)
                            : ""
                        }
                        alt="Profile preview"
                        className="h-25 w-40 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={isCreating}
                        className="absolute top-1 left-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                        onClick={removeImg}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <Select
                    onValueChange={handleRoleChange}
                    defaultValue={field.value}
                    disabled={!!field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        value={field.value}
                        className="w-full cursor-pointer"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="fieldAgent">Field Agent</SelectItem>
                      <SelectItem value="customerAgent">
                        Customer Agent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full md:w-auto cursor-pointer"
            disabled={isSubmitting || isCreating}
          >
            {isSubmitting || isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateAccountForm;
