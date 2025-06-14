import { useQueryClient } from "@tanstack/react-query";
import { usePropertyById } from "../usePropertyById";
import CreatePropertyForm from "../addProperties/CreatePropertyForm";

interface EditPropertyProps {
  propertyId: string;
  onClose: () => void;
  onSuccess?: () => void;
  id?: string;
}

function EditProperty({ propertyId, onClose }: EditPropertyProps) {
  const queryClient = useQueryClient();
  const { data: property, isPending, error } = usePropertyById({ propertyId });

  if (isPending) return <div className="p-4">Loading property details...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading property</div>;
  if (!property) return <div className="p-4">Property not found</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 w-full h-screen bg-backdrop-color backdrop-blur-sm transition-all duration-500">
      <div className="  w-full max-w-6xl h-[100vh]  bg-white overflow-y-scroll rounded-lg shadow-lg p-12 transition-all duration-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Property</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <CreatePropertyForm
          isEditMode
          id={propertyId}
          initialValues={property}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["property"],
            });
            onClose();
          }}
        />
      </div>
    </div>
  );
}

export default EditProperty;
