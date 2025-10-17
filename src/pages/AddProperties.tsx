import CreatePropertyForm from "@/features/addProperties/CreatePropertyForm";

export default function AddProperties() {
  return (
    <div className="w-full min-h-dvh pt-20 md:px-6 px-3">
      <div className="py-6 px-3 sm:p-8 bg-white rounded-3xl shadow-md">
        <CreatePropertyForm id="" />
      </div>
    </div>
  );
}
