import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600 text-lg">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Button onClick={() => navigate("/")}>Go back home</Button>
    </div>
  );
}
