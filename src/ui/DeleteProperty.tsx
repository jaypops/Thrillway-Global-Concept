import { Button } from "@/components/ui/button";
import { useDeleteProperty } from "@/features/addProperties/usePropertyMutation";
import { Property } from "@/services/type";

interface DeletePropertyProps {
  _id: Property["_id"];
  onClose: () => void;
}

function DeleteProperty({ _id, onClose }: DeletePropertyProps) {
  const { mutate: deleteProperty, isPending: isdeleting } = useDeleteProperty();
  const handleDelete = async () => {
    try {
      await deleteProperty({ id: _id });
      onClose();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 w-full h-screen bg-backdrop-color backdrop-blur-sm transition-all duration-500">
      <div className="  w-full max-w-2xl h-[30vh]  bg-white rounded-lg shadow-lg p-10 transition-all duration-500">
        <div className="space-y-2">
          <p className="font-semibold">Are you absolutely sure?</p>
          <h3 className="font-medium">
            This action cannot be undone. This will permanently delete this
            property data from the server.
          </h3>
          <div className="flex gap-4 flex-row-reverse space-y-4  ">
 
            <Button
              className="cursor-pointer"
              variant="destructive"
              disabled={isdeleting}
              onClick={handleDelete}
            >
              {isdeleting ? "Deleting..." : "Continue"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteProperty;
