import { Button } from "@/components/ui/button";
import {
  useDeleteProperty,
  useDeleteAllProperty,
} from "@/features/usePropertyMutation";
import { Property } from "@/services/type";

interface DeletePropertyProps {
  _id?: Property["_id"];
  ids?: Property["_id"][];
  onClose: () => void;
}

function DeleteProperty({ _id, ids, onClose }: DeletePropertyProps) {
  const { mutate: deleteProperty, isPending: isDeletingSingle } =
    useDeleteProperty();
  const { mutate: deleteAllProperty, isPending: isDeletingBulk } =
    useDeleteAllProperty();

  const isBulkDeletion = !!ids && ids.length > 0;
  const isPending = isDeletingSingle || isDeletingBulk;

  const handleDelete = async () => {
    try {
      if (isBulkDeletion) {
        await deleteAllProperty(ids!, {
          onSuccess: () => onClose(),
        });
      } else if (_id) {
        await deleteProperty(
          { id: _id },
          {
            onSuccess: () => onClose(),
          }
        );
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 w-full h-screen bg-black/40 backdrop-blur-none transition-all duration-500">
      <div className="w-full max-w-[35rem] h-[20vh] bg-white rounded-lg shadow-lg p-6 transition-all duration-500">
        <div className="space-y-2 flex flex-col justify-between h-full">
          <p className="font-semibold">Are you absolutely sure?</p>
          <h3 className="text-[13px] sm:pl-2">
            This action cannot be undone. This will permanently delete{" "}
            {isBulkDeletion ? `${ids!.length} properties` : "this property"}{" "}
            from the server.
          </h3>
          <div className="flex gap-4 flex-row-reverse space-y-4 ">
            <Button
              className="cursor-pointer text-[13px]" 
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending ? "Deleting..." : "Continue"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer text-[13px]"
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
