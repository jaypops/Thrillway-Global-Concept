import { Button } from "@/components/ui/button";
import CreateAccountForm from "@/features/accountManagement/CreateAccountForm";
import ProfileCard from "@/features/accountManagement/ProfileCard";
import { Plus } from "lucide-react";
import { useState } from "react";

function AccountManagement() {
  const [showForm, setShowForm] = useState<boolean>(false); 

  function handleToggleForm() {
    setShowForm(!showForm); 
  }

  return (
    <div>
      <p className="text-2xl font-semibold pt-2 p-2">Account Management</p>
      <div className="pt-4 pl-8 pb-8">
        <Button
          onClick={handleToggleForm}
          disabled={showForm} 
          variant="outline"
          size="lg"
          className="w-full md:w-auto cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add staff
        </Button>
      </div>
      {showForm && (
        <CreateAccountForm setShowForm={setShowForm} />
      )}
      {!showForm && <ProfileCard />}
    </div>
  );
}

export default AccountManagement;