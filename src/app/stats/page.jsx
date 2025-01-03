"use client";

import Navbar from "@/components/navbar";
import InchargeStats from "@/components/incharge-stats";
import { Button } from "@/components/ui/button";
import AdminStats from "@/components/admin-stats";
import MemberStats from "@/components/member-stats";
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
      <div className="container mx-auto px-2 sm:px-4 pt-4 sm:pt-8 mt-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
            {role === "admin"
              ? "Admin"
              : role === "volunteer"
              ? "Member"
              : "Incharge"}{" "}
            Statistics
          </h1>
          {role === "admin" && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Button
                onClick={() => setShowEdStats(!showEdStats)}
                className="bg-blue-800 hover:bg-blue-900"
              >
                Show {showEdStats ? "Admin" : "ED"} Stats
              </Button>
              {showEdStats && (
                <Select
                  value={inchargeEmail}
                  onValueChange={(value) => {
                    setInchargeEmail(value);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[200px] bg-white text-black">
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
        {role === "admin" ? (
          showEdStats ? (
            inchargeEmail ? (
              <InchargeStats
                key={inchargeEmail}
                inchargeEmail={inchargeEmail}
              />
            ) : (
              <p className="mt-20 sm:mt-40 text-center text-base sm:text-lg text-red-500">
                Please select an ED
              </p>
            )
          ) : (
            <AdminStats />
          )
        ) : null}
        {role === "incharge" && <InchargeStats />}
        {role === "volunteer" && <MemberStats />}
      </div>
    </>
  );
}

export default Page;
