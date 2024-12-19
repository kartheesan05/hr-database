"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getHrData } from "@/lib/actions";
import { useRouter } from "next-nprogress-bar";
import PaginationControls from "@/components/hr/pagination-controls";
import SearchForm from "@/components/hr/search-form";
import HrDetailsDialog from "@/components/hr/hr-details-dialog";
import HrTable from "@/components/hr/hr-table";

export default function HrDetails() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    phoneNumber: "",
    search: "",
    interview: "",
    status: "",
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
  const [isNavigating, setIsNavigating] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup function to abort any pending requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    fetchHrData();
  }, [currentPage, searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const fetchHrData = async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    try {
      const result = await getHrData(
        currentPage, 
        recordsPerPage, 
        searchParams, 
        abortControllerRef.current.signal
      );
      setHrData(result.data);
      setTotalCount(result.totalCount);
      if (
        result.totalCount > 0 &&
        currentPage > Math.ceil(result.totalCount / recordsPerPage)
      ) {
        setCurrentPage(1);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError("An error occurred while fetching HR data. Please try again.");
      }
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
    if (isNavigating || isLoading) return; // Prevent navigation if already in progress
    setIsNavigating(true);
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Reset navigation lock after a short delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  };

  const showDetails = (hr) => {
    setSelectedHr(hr);
    setIsDialogOpen(true);
  };


  return (
    <>
    <div className="min-h-screen w-screen p-[75px] bg-blue-50 relative">
      
      <Card className="mb-6  shadow-blue-100 rounded-lg">
        {/* <CardHeader className="bg-blue-100 rounded-t-lg mb-4">
          <CardTitle className="text-blue-800 text-center text-3xl font-bold">
            HR Database
          </CardTitle>
        </CardHeader> */}
        <CardContent className="pt-6 bg-white rounded-lg">
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
    </>
  );
} 
