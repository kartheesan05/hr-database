"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-white hover:bg-blue-100 text-blue-800 border border-blue-200"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}

export default LogoutButton;