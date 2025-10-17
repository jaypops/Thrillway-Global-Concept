import { Button } from "@/components/ui/button";
import { InviteLinkProvider } from "@/context/InviteLinkContext";
import InviteStaffModal from "@/features/accountManagement/InviteStaffModel";
import ProfileCard from "@/features/accountManagement/ProfileCard";
import { FaArrowLeft } from "react-icons/fa6";
import { Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function AccountManagement() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "admin" | "fieldAgent" | "customerAgent" | null
  >(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isAddingStaff = location.pathname.endsWith("/add-staff");

  return (
    <div className="md:px-6 px-3 pt-20">
      <div className="bg-white rounded-3xl shadow-md pt-2">
        <div className="pt-4 md:pl-8  pb-8 flex justify-between items-center ">
          <div className="flex items-center space-x-3">
            <FaArrowLeft
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />

            {!isAddingStaff && (
              <Button
                onClick={() => navigate("add-staff")}
                variant="outline"
                size="lg"
                className="w-full md:w-auto cursor-pointer text-xs"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add staff
              </Button>
            )}
          </div>

          <div className="md:pr-7 pr-4">
            <Button
              onClick={() => setShowInviteModal(!showInviteModal)}
              disabled={!selectedRole}
              variant="default"
              size="lg"
              className="w-full md:w-auto cursor-pointer text-primary-foreground text-xs"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Staff
            </Button>
          </div>
        </div>

        {isAddingStaff ? (
          <Outlet context={{ setSelectedRole }} />
        ) : (
          <ProfileCard />
        )}

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
    </div>
  );
}

export default AccountManagement;
