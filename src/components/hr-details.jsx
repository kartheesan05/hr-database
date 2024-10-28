"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getHrData } from "@/lib/actions";
import { useRouter } from "next/navigation";
import PaginationControls from "@/components/hr/pagination-controls";
import SearchForm from "@/components/hr/search-form";
import HrDetailsDialog from "@/components/hr/hr-details-dialog";
import HrTable from "@/components/hr/hr-table";

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
  const router = useRouter();

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
    setCurrentPage(1);
    fetchHrData();
  };

  const totalPages = Math.ceil(totalCount / recordsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showDetails = (hr) => {
    setSelectedHr(hr);
    setIsDialogOpen(true);
  };

  const handleLogout = () => {
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-screen p-[75px] bg-blue-50 relative">
      <Button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-white hover:bg-blue-100 text-blue-800 border border-blue-200"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
      <Card className="mb-6 border-blue-200 shadow-blue-100 rounded-lg">
        <CardHeader className="bg-blue-100 rounded-t-lg mb-4">
          <CardTitle className="text-blue-800 text-center text-3xl font-bold">
            HR Database
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white rounded-lg">
          <SearchForm
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
          />
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        recordsPerPage={recordsPerPage}
        onPageChange={goToPage}
      />
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <HrTable 
          hrData={hrData}
          isLoading={isLoading}
          currentPage={currentPage}
          recordsPerPage={recordsPerPage}
          showDetails={showDetails}
        />
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        recordsPerPage={recordsPerPage}
        onPageChange={goToPage}
      />
      <HrDetailsDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedHr={selectedHr}
      />
    </div>
  );
}
