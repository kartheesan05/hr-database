"use client";

import { Info, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HrTable({ 
  hrData, 
  isLoading, 
  currentPage, 
  recordsPerPage, 
  showDetails 
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (hrData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No results found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className={cn("bg-blue-100 hover:bg-blue-200")}>
          <TableHead className="text-blue-800 text-center">S.No</TableHead>
          <TableHead className="text-blue-800">HR Name</TableHead>
          <TableHead className="text-blue-800">Volunteer</TableHead>
          <TableHead className="text-blue-800">Incharge</TableHead>
          <TableHead className="text-blue-800">Company</TableHead>
          <TableHead className="text-blue-800">Email</TableHead>
          <TableHead className="text-blue-800">Number</TableHead>
          <TableHead className="text-blue-800 w-[150px] text-center">Status</TableHead>
          <TableHead className="text-blue-800">Interview Mode</TableHead>
          <TableHead className="text-blue-800">HR Count</TableHead>
          <TableHead className="text-blue-800">Show Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hrData.map((hr, index) => (
          <TableRow
            key={hr.id}
            className={cn(
              index % 2 === 0 ? "bg-blue-50" : "bg-white",
              "hover:bg-blue-100"
            )}
          >
            <TableCell className="text-center">
              {(currentPage - 1) * recordsPerPage + index + 1}
            </TableCell>
            <TableCell>{hr.hr_name}</TableCell>
            <TableCell>{hr.volunteer}</TableCell>
            <TableCell>{hr.incharge}</TableCell>
            <TableCell>{hr.company}</TableCell>
            <TableCell>{hr.email}</TableCell>
            <TableCell>{hr.phone_number}</TableCell>
            <TableCell className="text-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${
                  hr.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : hr.status === "Inactive"
                    ? "bg-red-100 text-red-800"
                    : hr.status === "Email_Sent"
                    ? "bg-blue-100 text-blue-800"
                    : hr.status === "Not_Called"
                    ? "bg-orange-100 text-orange-800"
                    : hr.status === "Blacklisted"
                    ? "bg-gray-900 text-white"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {hr.status === "Active"
                  ? "Accepted"
                  : hr.status === "Inactive"
                  ? "Declined"
                  : hr.status === "Email_Sent"
                  ? "Email Sent"
                  : hr.status === "Not_Called"
                  ? "Not Called"
                  : hr.status === "Blacklisted"
                  ? "Blacklisted"
                  : "Pending"}
              </span>
            </TableCell>
            <TableCell>{hr.interview_mode}</TableCell>
            <TableCell>{hr.hr_count}</TableCell>
            <TableCell>
              <Button
                onClick={() => showDetails(hr)}
                className="bg-blue-800 hover:bg-blue-900"
              >
                <Info className="h-4 w-4 mr-2" />
                Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
