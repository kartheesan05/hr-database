"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next-nprogress-bar";
import { useState, useEffect } from "react";
function WelcomePage() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center pt-16 p-4">
      {/* Logo Section */}
      <img src="/forese-logo.png" alt="Forese Logo" className="w-56" />

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-blue-800 text-center mb-6">
        FORESE HR Database
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-gray-700 text-center max-w-3xl mb-12 leading-relaxed">
        Mock Placements is a flagship event organized by FORESE. Each year we
        have an attendance over 100 HRs and other technical personnel from
        several companies who are invited to examine the technical strength of
        about 800+ pre final year students.
      </p>

      {/* Sign In Button */}
      {!role ? (
        <Button
          onClick={() => router.push("/login")}
          className="bg-blue-800 hover:bg-blue-900 text-white px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Login
        </Button>
      ) : (
        <Button
          onClick={() => router.push("/")}
          className="bg-blue-800 hover:bg-blue-900 text-white px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          View HR Database
        </Button>
      )}

      {/* Footer */}
      <div className="mt-auto py-8 text-center text-gray-600">
        <p>
          Designed & Developed by{" "}
          <a
            // href="https://tech.forese.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 hover:text-blue-600 font-semibold"
          >
            FORESE - TECH
          </a>
        </p>
      </div>
    </div>
  );
}

export default WelcomePage;
