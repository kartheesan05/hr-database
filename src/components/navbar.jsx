"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="max-w-screen px-4 mx-auto flex justify-between items-center h-16">
        <h1
          className="text-blue-800 text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          HR Database
        </h1>

        <div className="flex gap-6">
          <span
            onClick={() => router.push("/")}
            className="text-blue-800 hover:text-blue-600 cursor-pointer font-bold transition-all duration-200 border-b-2 border-transparent hover:border-blue-600"
          >
            Home
          </span>
          {localStorage.getItem("role") === "admin" && (
            <>
              <span
                onClick={() => router.push("/add-user")}
                className="text-blue-800 hover:text-blue-600 cursor-pointer font-bold transition-all duration-200 border-b-2 border-transparent hover:border-blue-600"
              >
                Add User
              </span>
            </>
          )}
          {(localStorage.getItem("role") === "admin" ||
            localStorage.getItem("role") === "incharge") && (
            <>
              <span
                onClick={() => router.push("/stats")}
                className="text-blue-800 hover:text-blue-600 cursor-pointer font-bold transition-all duration-200 border-b-2 border-transparent hover:border-blue-600"
              >
                Stats
              </span>
            </>
          )}
          <span
            onClick={() => router.push("/add-hr")}
            className="text-blue-800 hover:text-blue-600 cursor-pointer font-bold transition-all duration-200 border-b-2 border-transparent hover:border-blue-600"
          >
            Add HR
          </span>
          <span
            onClick={() => router.push("/hr-pitch")}
            className="text-blue-800 hover:text-blue-600 cursor-pointer font-bold transition-all duration-200 border-b-2 border-transparent hover:border-blue-600"
          >
            HR Pitch
          </span>
          <span
            onClick={() => router.push("/csv-upload")}
            className="text-blue-800 hover:text-blue-600 cursor-pointer font-bold transition-all duration-200 border-b-2 border-transparent hover:border-blue-600"
          >
            CSV Upload
          </span>
        </div>

        <div className="flex gap-2">
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
