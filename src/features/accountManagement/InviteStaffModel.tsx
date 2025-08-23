import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Share, Users, Link2 } from "lucide-react";
import { useInviteLink } from "@/context/InviteLinkContext";

export default function InviteStaffModal() {
  const {
    isOpen,
    isGenerating,
    inviteLink,
    copied,
    error,
    handleGenerate,
    handleClose,
    setCopied,
  } = useInviteLink();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-primary" />
            Invite New Staff Member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {!inviteLink ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <Share className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Generate Invitation Link</h3>
                <p className="text-sm text-muted-foreground">
                  Create a secure link that allows new staff members to register
                  and join your team.
                </p>
              </div>
              <Button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Generate Invite Link
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-success-light rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-medium text-success">
                  Link Generated Successfully!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Share this link with the new staff member. It will expire in
                  24 hours.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-link">Invitation Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-link"
                    value={inviteLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="shrink-0"
                    variant={copied ? "default" : "outline"}
                    onClick={() =>
                      navigator.clipboard.writeText(inviteLink).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      })
                    }
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
