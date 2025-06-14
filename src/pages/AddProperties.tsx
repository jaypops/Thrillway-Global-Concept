import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CreatePropertyForm from "@/features/addProperties/CreatePropertyForm";

export default function AddProperties() {
  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Property</CardTitle>
        <CardDescription>
          Fill in the details to list a new property
        </CardDescription>
      </CardHeader>
      <div className="p-14">
        <CreatePropertyForm />
      </div>
    </div>
  );
}
