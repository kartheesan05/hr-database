"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function Navbar({ hrpage }) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-blue-200 shadow-sm z-10">
      <div className="max-w-screen px-4 mx-auto flex justify-between items-center h-16">
        <h1 className="text-blue-800 text-2xl font-bold">HR Database</h1>

        <div className="flex gap-2">
          {hrpage && (
            <Button
              onClick={() => router.push("/add-hr")}
              className="bg-white hover:bg-blue-100 text-blue-800 border border-blue-200"
            >
              Add HR
            </Button>
          )}

          <Button
            onClick={handleLogout}
            className="bg-white hover:bg-blue-100 text-blue-800 border border-blue-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
