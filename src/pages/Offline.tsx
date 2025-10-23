import { WifiOff } from "lucide-react";

export default function Offline() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center justify-center gap-2 w-auto max-w-md">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">
        You’re offline — check your internet connection.
      </span>
    </div>
  );
}
