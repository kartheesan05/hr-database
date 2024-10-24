"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Info, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import { getHrData } from "@/lib/actions";

export default function HrDetails() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    interview: "",
    company: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHr, setSelectedHr] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hrData, setHrData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const recordsPerPage = 100;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHrData();
  }, [currentPage, searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const fetchHrData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getHrData(currentPage, recordsPerPage, searchParams);
      setHrData(result.data);
      setTotalCount(result.totalCount);
      // Ensure currentPage is valid after search
      if (
        result.totalCount > 0 &&
        currentPage > Math.ceil(result.totalCount / recordsPerPage)
      ) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching HR data:", error);
      setError("An error occurred while fetching HR data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
    fetchHrData();
  };

  const totalPages = Math.ceil(totalCount / recordsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  const showDetails = (hr) => {
    setSelectedHr(hr);
    setIsDialogOpen(true);
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="text-sm text-gray-700">
        Showing {totalCount > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0} to{" "}
        {Math.min(currentPage * recordsPerPage, totalCount)} of {totalCount}{" "}
        results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalCount === 0}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-screen p-[75px] bg-purple-50">
      <Card className="mb-6 border-purple-200 shadow-purple-100 rounded-lg">
        <CardHeader className="bg-purple-100 rounded-t-lg mb-4">
          <CardTitle className="text-purple-800 text-center text-3xl font-bold">
            HR Database
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                placeholder="Name"
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    name: e.target.value.trim(),
                  })
                }
                className="border-purple-200 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Phone Number"
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    phoneNumber: e.target.value.trim(),
                  })
                }
                className="border-purple-200 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                placeholder="Email"
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    email: e.target.value.trim(),
                  })
                }
                className="border-purple-200 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="interviewMode" className="block text-sm font-medium text-gray-700">Interview Mode</Label>
              <Select
                id="interviewMode"
                onValueChange={(value) =>
                  setSearchParams({
                    ...searchParams,
                    interview: value === "Both" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                  <SelectValue placeholder="Interview Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="In-person">In-person</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</Label>
              <Input
                id="company"
                placeholder="Company"
                onChange={(e) =>
                  setSearchParams({ ...searchParams, company: e.target.value })
                }
                className="border-purple-200 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700 w-full"
              >
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <PaginationControls />
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : hrData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className={cn("bg-purple-100 hover:bg-purple-200")}>
                <TableHead className="text-purple-800">S.No</TableHead>
                <TableHead className="text-purple-800">HR Name</TableHead>
                <TableHead className="text-purple-800">Volunteer</TableHead>
                <TableHead className="text-purple-800">Incharge</TableHead>
                <TableHead className="text-purple-800">Company</TableHead>
                <TableHead className="text-purple-800">Email</TableHead>
                <TableHead className="text-purple-800">Number</TableHead>
                <TableHead className="text-purple-800">Status</TableHead>
                <TableHead className="text-purple-800">
                  Interview Mode
                </TableHead>
                <TableHead className="text-purple-800">HR Count</TableHead>
                <TableHead className="text-purple-800">Transport</TableHead>
                <TableHead className="text-purple-800">Show Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hrData.map((hr, index) => (
                <TableRow
                  key={hr.id}
                  className={cn(
                    index % 2 === 0 ? "bg-purple-50" : "bg-white",
                    "hover:bg-purple-100"
                  )}
                >
                  <TableCell>
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
                      {hr.status}
                    </span>
                  </TableCell>
                  <TableCell>{hr.interview_mode}</TableCell>
                  <TableCell>{hr.hr_count}</TableCell>
                  <TableCell>{hr.transport}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => showDetails(hr)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No results found.
          </div>
        )}
      </div>
      <PaginationControls />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>HR Details</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedHr && (
                <span className="space-y-2 flex flex-col">
                  <span className="">
                    <strong className="text-purple-600">Name:</strong>{" "}
                    <span className="text-gray-700">{selectedHr.hr_name}</span>
                  </span>
                  <span className="">
                    <strong className="text-purple-600">Company:</strong>{" "}
                    <span className="text-gray-700">{selectedHr.company}</span>
                  </span>
                  <span className="">
                    <strong className="text-purple-600">Address:</strong>{" "}
                    <span className="text-gray-700">{selectedHr.address}</span>
                  </span>
                  <span className="">
                    <strong className="text-purple-600">Internship:</strong>{" "}
                    <span className="text-gray-700">
                      {selectedHr.internship}
                    </span>
                  </span>
                  <span className="">
                    <strong className="text-purple-600">Comments:</strong>{" "}
                    <span className="text-gray-700">{selectedHr.comments}</span>
                  </span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-purple-600 hover:bg-purple-700">
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
