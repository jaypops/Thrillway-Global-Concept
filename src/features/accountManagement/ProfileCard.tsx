import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MapPin, Calendar, User, Shield } from "lucide-react";
import { useAccount } from "../useAccount";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DeleteAccount from "./DeleteAccount";
import Loader from "@/ui/Loader";

function ProfileCard() {
  const { accounts, isPending, error } = useAccount();
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  if (isPending) return <Loader />;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!accounts || accounts.length === 0)
    return <div className="p-4">No accounts found</div>;

  const handleDeleteClick = (id: string) => {
    setAccountToDelete(id);
  };

  const handleCloseDialog = () => {
    setAccountToDelete(null);
  };
  return (
    <div className="space-y-4 flex items-center justify-center flex-wrap p-4">
      {accounts.map((account) => (
        <Card key={account._id} className="w-full max-w-sm mx-auto relative">
          <CardHeader className="text-center pb-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-20 h-19 sm:w-24 sm:h-24">
                <AvatarImage
                  src={
                    Array.isArray(account.images)
                      ? account.images[0] || "/placeholder.svg?height=96&width=96"
                      : account.images || "/placeholder.svg?height=96&width=96"
                  }
                  alt={account.name}
                />
                <AvatarFallback className="text-sm sm:text-lg font-semibold">
                  {account.name}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-lg sm:text-2xl font-bold">{account.name}</h2>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  <User className="w-3 h-3 mr-1" />@{account.username}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">{account.telephone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium">Emergency Contact</p>
                  <p className="text-muted-foreground">
                    {account.emergencyContact}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {account.address}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-muted-foreground">{account.startDate}</p>
                  </div>
                </div>
                <div className=" gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteClick(account._id!)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <FaRegTrashAlt />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          {accountToDelete === account._id && (
            <DeleteAccount onClose={handleCloseDialog} _id={accountToDelete} />
          )}
        </Card>
      ))}
    </div>
  );
}

export default ProfileCard;
