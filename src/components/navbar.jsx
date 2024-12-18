"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

function Navbar() {
  const router = useRouter();

  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem("role");
      setRole(userRole);
    }
  }, []);

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

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div className="hidden md:flex gap-6">
          <span
            onClick={() => router.push("/")}
            className="text-blue-800 hover:text-blue-600 cursor-pointer font-bold transition-all duration-200 border-b-2 border-transparent hover:border-blue-600"
          >
            Home
          </span>
          {role === "admin" && (
            <>
              <span
                onClick={() => router.push("/add-user")}
                className="text-blue-800 hover:text-blue-600 cursor-pointer font-bold transition-all duration-200 border-b-2 border-transparent hover:border-blue-600"
              >
                Add User
              </span>
            </>
          )}
          {(role === "admin" || role === "incharge") && (
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

        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:hidden absolute top-16 left-0 right-0 flex-col bg-white border-b border-gray-200 shadow-sm`}
        >
          <span
            onClick={() => {
              router.push("/");
              setIsMenuOpen(false);
            }}
            className="p-4 text-blue-800 hover:bg-blue-50 cursor-pointer font-bold"
          >
            Home
          </span>
          {role === "admin" && (
            <span
              onClick={() => {
                router.push("/add-user");
                setIsMenuOpen(false);
              }}
              className="p-4 text-blue-800 hover:bg-blue-50 cursor-pointer font-bold"
            >
              Add User
            </span>
          )}
          {(role === "admin" || role === "incharge") && (
            <span
              onClick={() => {
                router.push("/stats");
                setIsMenuOpen(false);
              }}
              className="p-4 text-blue-800 hover:bg-blue-50 cursor-pointer font-bold"
            >
              Stats
            </span>
          )}
          <span
            onClick={() => {
              router.push("/add-hr");
              setIsMenuOpen(false);
            }}
            className="p-4 text-blue-800 hover:bg-blue-50 cursor-pointer font-bold"
          >
            Add HR
          </span>
          <span
            onClick={() => {
              router.push("/hr-pitch");
              setIsMenuOpen(false);
            }}
            className="p-4 text-blue-800 hover:bg-blue-50 cursor-pointer font-bold"
          >
            HR Pitch
          </span>
          <span
            onClick={() => {
              router.push("/csv-upload");
              setIsMenuOpen(false);
            }}
            className="p-4 text-blue-800 hover:bg-blue-50 cursor-pointer font-bold"
          >
            CSV Upload
          </span>
          <Button
            onClick={handleLogout}
            className="m-4 bg-white hover:bg-blue-100 text-blue-800 border border-blue-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="hidden md:flex gap-2">
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
