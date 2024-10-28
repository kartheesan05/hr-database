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
          <TableHead className="text-blue-800">Status</TableHead>
          <TableHead className="text-blue-800">Interview Mode</TableHead>
          <TableHead className="text-blue-800">HR Count</TableHead>
          <TableHead className="text-blue-800">Transport</TableHead>
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
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  hr.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : hr.status === "Inactive"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {hr.status === "Active"
                  ? "Accepted"
                  : hr.status === "Inactive"
                  ? "Declined"
                  : "Pending"}
              </span>
            </TableCell>
            <TableCell>{hr.interview_mode}</TableCell>
            <TableCell>{hr.hr_count}</TableCell>
            <TableCell>{hr.transport}</TableCell>
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
