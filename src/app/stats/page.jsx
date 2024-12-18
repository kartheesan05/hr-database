"use client";

import Navbar from "@/components/navbar";
import VolunteerStats from "@/components/volunteer-stats";
import InchargeStats from "@/components/incharge-stats";
import { useEffect, useState } from "react";

function Page() {
  const [role, setRole] = useState("incharge");

  useEffect(() => {
    if (window) {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  return (
    <>
      <Navbar />
      {role === "admin" && <InchargeStats />}
      {role === "incharge" && <VolunteerStats />}
    </>
  );
}

export default Page;
