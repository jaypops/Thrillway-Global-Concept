import { Button } from "@/components/ui/button";
import { InviteLinkProvider } from "@/context/InviteLinkContext";
import CreateAccountForm from "@/features/accountManagement/CreateAccountForm";
import InviteStaffModal from "@/features/accountManagement/InviteStaffModel";
import ProfileCard from "@/features/accountManagement/ProfileCard";
import { Plus, UserPlus } from "lucide-react";
import { useState } from "react";

function AccountManagement() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "fieldAgent" | "customerAgent" | null>(null); // Add this state

  function handleToggleForm() {
    setShowForm(!showForm);
  }

  function handleToggleInviteModal() {
    setShowInviteModal(!showInviteModal);
  }

  return (
    <div>
      <p className="text-2xl font-semibold pt-2 p-2">Account Management</p>
      <div className="pt-4 pl-8 pb-8 flex justify-between items-center">
        <div>
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
        <div className="pr-7">
          <Button
            onClick={handleToggleInviteModal}
            disabled={!selectedRole} 
            variant="default"
            size="lg"
            className="w-full md:w-auto cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Staff
          </Button>
        </div>
      </div>
      {showForm && <CreateAccountForm setShowForm={setShowForm} setSelectedRole={setSelectedRole} />}
      {!showForm && <ProfileCard />}
      {showInviteModal && (
        <InviteLinkProvider
          isOpen={showInviteModal}
          onOpenChange={setShowInviteModal}
          initialRole={selectedRole}
        >
          <InviteStaffModal />
        </InviteLinkProvider>
      )}
    </div>
  );
}

export default AccountManagement;
