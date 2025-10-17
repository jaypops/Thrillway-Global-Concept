import { Button } from "@/components/ui/button";
import {
  useDeleteProperty,
  useDeleteAllProperty,
} from "@/features/usePropertyMutation";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

interface DeletePropertyProps {
  ids?: string[];
  onClose?: () => void;
  isRoute?: boolean;
}

function DeleteProperty({
  ids,
  onClose,
  isRoute = false,
}: DeletePropertyProps) {
  const routeParams = useParams();
  const navigate = useNavigate();

  const finalIds = ids || (routeParams.id ? [routeParams.id] : []);

  const handleClose = onClose || (() => navigate(-1));

  const isBulk = finalIds.length > 1;
  const { mutate: deleteProperty, isPending: deletingOne } =
    useDeleteProperty();
  const { mutate: deleteMany, isPending: deletingMany } =
    useDeleteAllProperty();
  const isPending = deletingOne || deletingMany;

  const handleDelete = () => {
    if (isBulk) {
      deleteMany(finalIds, {
        onSuccess: handleClose,
        onError: (error) => {
          console.error("Failed to delete properties:", error);
        },
      });
    } else {
      deleteProperty(
        { id: finalIds[0] },
        {
          onSuccess: handleClose,
          onError: (error) => {
            console.error("Failed to delete property:", error);
          },
        }
      );
    }
  };

  if (isRoute && finalIds.length === 0) {
    return <div className="p-4 text-red-500">Invalid property ID</div>;
  }

  const content = (
    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
      <h3 className="font-semibold text-lg">Are you absolutely sure?</h3>
      <p className="text-sm text-gray-600 mt-2">
        This action cannot be undone. This will permanently delete{" "}
        {isBulk ? `${finalIds.length} properties` : "this property"} from the
        server.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner />
              Deleting...
            </>
          ) : (
            "Continue"
          )}
        </Button>

        <Button variant="outline" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );

  if (isRoute) {
    return (
      <div className="w-full px-3 md:px-6 pt-20">
        <div className="bg-white rounded-3xl shadow-md px-4 md:px-6 py-4">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      {content}
    </div>
  );
}

export default DeleteProperty;
