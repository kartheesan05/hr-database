"use client";

import Navbar from "@/components/navbar";
import InchargeStats from "@/components/incharge-stats";
import AdminStats from "@/components/admin-stats";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Page() {
  const [role, setRole] = useState("incharge");
  const [inchargeEmail, setInchargeEmail] = useState("");
  const [showEdStats, setShowEdStats] = useState(false);

  const edList = [
    { name: "Arunima", email: "arunima@forese.co.in" },
    { name: "Jhalak", email: "jhalak@forese.co.in" },
    { name: "Karthik", email: "karthik@forese.co.in" },
    { name: "Sandhya", email: "sandhya@forese.co.in" },
    { name: "Sanjana", email: "sanjana@forese.co.in" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role") || "incharge");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            {role === "admin" ? "ED" : "Incharge"} Statistics
          </h1>
          {role === "admin" && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowEdStats(!showEdStats)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Show {showEdStats ? "Admin" : "ED"} Stats
              </button>
              {showEdStats && (
                <Select 
                  value={inchargeEmail}
                  onValueChange={(value) => {
                    setInchargeEmail(value);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select ED" />
                  </SelectTrigger>
                  <SelectContent>
                    {edList.map((ed) => (
                      <SelectItem key={ed.email} value={ed.email}>
                        {ed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
        {(role === "admin") ? (
          showEdStats ? (
            inchargeEmail ? <InchargeStats key={inchargeEmail} inchargeEmail={inchargeEmail} /> : <p>Please select an ED</p>
          ) : (
            <AdminStats />
          )
        ) : null}
        {role === "incharge" && (
          <InchargeStats />
        )}
      </div>
    </>
  );
}

export default Page;
