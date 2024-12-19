"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

function Navbar() {
  const router = useRouter();

  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("role");
      setRole(userRole);
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const handleLogout = () => {
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const getLinkStyle = (path) => {
    const baseStyle =
      "text-blue-800 cursor-pointer font-bold transition-all duration-200 border-b-2";
    return `${baseStyle} ${
      currentPath === path
        ? "border-blue-600"
        : "border-transparent hover:border-blue-600 hover:text-blue-600"
    }`;
  };

  return (
    <>
      {/* <ProgressBar
        height="2px"
        color="#1e40af"
        options={{ showSpinner: false }}
        shallowRouting={true}
        // style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      /> */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="max-w-screen px-4 mx-auto flex justify-between items-center h-16 relative">
          <div
            className="absolute left-4 flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img
              src="/forese-logo.png"
              alt="Forese Logo"
              className="h-[6rem] w-auto"
            />
            <h1 className="text-blue-800 text-2xl font-bold">HR Database</h1>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden ml-auto p-2"
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

          <div className="hidden md:flex gap-6 mx-auto items-center mt-1">
            <span
              onClick={() => router.push("/")}
              className={getLinkStyle("/")}
            >
              Home
            </span>
            {role === "admin" && (
              <span
                onClick={() => router.push("/add-user")}
                className={getLinkStyle("/add-user")}
              >
                Add User
              </span>
            )}
            {(role === "admin" || role === "incharge") && (
              <span
                onClick={() => router.push("/stats")}
                className={getLinkStyle("/stats")}
              >
                Stats
              </span>
            )}
            <span
              onClick={() => router.push("/add-hr")}
              className={getLinkStyle("/add-hr")}
            >
              Add HR
            </span>
            <span
              onClick={() => router.push("/hr-pitch")}
              className={getLinkStyle("/hr-pitch")}
            >
              HR Pitch
            </span>
            <span
              onClick={() => router.push("/csv-upload")}
              className={getLinkStyle("/csv-upload")}
            >
              CSV Upload
            </span>
          </div>

          <div className="hidden md:flex gap-2 absolute right-4">
            <Button
              onClick={handleLogout}
              className="bg-white hover:bg-blue-100 text-blue-800 border border-blue-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
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
              className={`p-4 cursor-pointer font-bold ${
                currentPath === "/" ? "bg-blue-50" : "hover:bg-blue-50"
              } text-blue-800`}
            >
              Home
            </span>
            {role === "admin" && (
              <span
                onClick={() => {
                  router.push("/add-user");
                  setIsMenuOpen(false);
                }}
                className={`p-4 cursor-pointer font-bold ${
                  currentPath === "/add-user"
                    ? "bg-blue-50"
                    : "hover:bg-blue-50"
                } text-blue-800`}
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
                className={`p-4 cursor-pointer font-bold ${
                  currentPath === "/stats" ? "bg-blue-50" : "hover:bg-blue-50"
                } text-blue-800`}
              >
                Stats
              </span>
            )}
            <span
              onClick={() => {
                router.push("/add-hr");
                setIsMenuOpen(false);
              }}
              className={`p-4 cursor-pointer font-bold ${
                currentPath === "/add-hr" ? "bg-blue-50" : "hover:bg-blue-50"
              } text-blue-800`}
            >
              Add HR
            </span>
            <span
              onClick={() => {
                router.push("/hr-pitch");
                setIsMenuOpen(false);
              }}
              className={`p-4 cursor-pointer font-bold ${
                currentPath === "/hr-pitch" ? "bg-blue-50" : "hover:bg-blue-50"
              } text-blue-800`}
            >
              HR Pitch
            </span>
            <span
              onClick={() => {
                router.push("/csv-upload");
                setIsMenuOpen(false);
              }}
              className={`p-4 cursor-pointer font-bold ${
                currentPath === "/csv-upload"
                  ? "bg-blue-50"
                  : "hover:bg-blue-50"
              } text-blue-800`}
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
        </div>
      </nav>
    </>
  );
}

export default Navbar;
