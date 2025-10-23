import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { validateInvitationToken } from "@/services/apiAccount";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CreateAccountForm from "@/features/accountManagement/CreateAccountForm";
import Loader from "@/ui/Loader";

export default function InvitationRegistration() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setError("No invitation token provided");
      setLoading(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await validateInvitationToken(token);
        if (response.success) {
          setValid(true);
          localStorage.setItem("invitationToken", token);
        } else {
          setError(response.message || "Invalid or expired invitation link");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Failed to validate invitation");
        } else {
          setError("Failed to validate invitation");
        }
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-4">
              <Loader />
              <span className="ml-2">Validating invitation...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <button 
              onClick={() => navigate("/login")}
              className="mt-4 w-full bg-primary text-white py-2 rounded-md"
            >
              Go to Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Complete Your Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateAccountForm 
              setShowForm={() => {}} 
              isInvitationFlow={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}