import { useEffect, useState } from "react";
import OfflineBanner from "@/pages/Offline";

interface Props {
  children: React.ReactNode;
}

export default function OnlineStatusBannerWrapper({ children }: Props) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && <OfflineBanner />}
      {children}
    </>
  );
}
