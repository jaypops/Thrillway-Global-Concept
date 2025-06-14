import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/features/accountManagement/accountSchema";
import toast from "react-hot-toast";
import { Account } from "@/services/type";
import { format } from "date-fns";
import { useCreateAccount } from "../useAccountMutation";

type FormValues = z.infer<typeof formSchema>;

interface UseAccountFormOptions {
  initialValues?: Partial<Account>;
}

export const useAccountForm = ({
  initialValues = {},
}: UseAccountFormOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null); 
  const { mutate: createAccount, isPending: isCreating } = useCreateAccount();

  const parsedInitialValues = {
    ...initialValues,
    startDate: initialValues.startDate
      ? typeof initialValues.startDate === "string"
        ? new Date(initialValues.startDate)
        : initialValues.startDate
      : undefined,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      telephone: "",
      emergencyContact: "",
      email: "",
      address: "",
      image: undefined,
      ...parsedInitialValues,
    },
  });

  const handleImageUpload = (file: File) => {
    setImage(file); 
    form.setValue("image", file); 
  };

  const removeImg = () => {
    setImage(null); 
    form.setValue("image", undefined); 
    form.trigger("image"); 
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    const formData = new FormData();

    try {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'startDate' && value) {
          formData.append(key, format(value, 'yyyy-MM-dd'));
        } else if (key !== 'image' && value) {
          formData.append(key, value.toString());
        }
      });
  
      if (image) {
        formData.append('image', image);
      }

      createAccount(formData, {
        onSuccess: () => {
          form.reset();
          setImage(null);
        },
        onError: (error) => {
          console.error("Error submitting form:", error);
          toast.error("There was a problem submitting your information.");
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was a problem submitting your information.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    onSubmit,
    handleImageUpload,
    isSubmitting,
    isCreating,
    image,
    setImage,
    removeImg
  };
};