import { useDeleteAccount } from "../useAccountMutation";
import { Account } from "@/services/type";
import { Button } from "@/components/ui/button";

interface DeletePropertyProps {
  _id?: Account["_id"];
  onClose: () => void;
}

function DeleteAccount({ _id, onClose }: DeletePropertyProps) {
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const handleDelete = async () => {
    try {
      if (_id) {
        await deleteAccount(
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
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 transition-all duration-500">
        <div className="space-y-2 flex flex-col justify-between h-full">
          <p className="font-semibold text-lg">Are you absolutely sure?</p>
          <h3 className="text-sm text-gray-600 mt-2">
            This action cannot be undone. This will permanently delete this
            staff from the server.
          </h3>
          <div className="flex gap-4 flex-row-reverse mt-6">
            <Button
              variant="destructive"
              className="cursor-pointer"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Continue"}
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

export default DeleteAccount;
