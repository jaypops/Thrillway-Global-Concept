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
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 w-full h-screen bg-backdrop-color backdrop-blur-sm transition-all duration-500">
      <div className="w-full max-w-[35rem] h-[25vh] bg-white rounded-lg shadow-lg p-6 transition-all duration-500">
        <div className="space-y-2">
          <p className="font-semibold">Are you absolutely sure?</p>
          <h3 className="font-medium pl-2">
            This action cannot be undone. This will permanently delete this
            staff from the server.
          </h3>
          <div className="flex gap-4 flex-row-reverse space-y-4">
            <Button
              className="cursor-pointer"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Continue"}
            </Button>
            <Button onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;
