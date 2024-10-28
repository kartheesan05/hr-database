import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({
  currentPage,
  totalPages,
  totalCount,
  recordsPerPage,
  onPageChange,
}) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="text-sm text-gray-700">
        Showing {totalCount > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0} to{" "}
        {Math.min(currentPage * recordsPerPage, totalCount)} of {totalCount}{" "}
        results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-800 hover:bg-blue-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalCount === 0}
          className="bg-blue-800 hover:bg-blue-900"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
