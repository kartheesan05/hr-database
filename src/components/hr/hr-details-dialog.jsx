import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next-nprogress-bar";

export default function HrDetailsDialog({
  isOpen,
  onOpenChange,
  selectedHr,
  role,
}) {
  const router = useRouter();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>HR Details</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedHr && (
              <span className="space-y-2 flex flex-col">
                <span className="">
                  <strong className="text-blue-600">Name:</strong>{" "}
                  <span className="text-gray-700">{selectedHr.hr_name}</span>
                </span>
                <span className="">
                  <strong className="text-blue-600">Company:</strong>{" "}
                  <span className="text-gray-700">{selectedHr.company}</span>
                </span>
                <span className="">
                  <strong className="text-blue-600">HR Count:</strong>{" "}
                  <span className="text-gray-700">{selectedHr.hr_count}</span>
                </span>
                <span className="">
                  <strong className="text-blue-600">Address:</strong>{" "}
                  <span className="text-gray-700">{selectedHr.address}</span>
                </span>
                <span className="">
                  <strong className="text-blue-600">Transport:</strong>{" "}
                  <span className="text-gray-700">{selectedHr.transport}</span>
                </span>
                <span className="">
                  <strong className="text-blue-600">Internship:</strong>{" "}
                  <span className="text-gray-700">{selectedHr.internship}</span>
                </span>
                <span className="">
                  <strong className="text-blue-600">Comments:</strong>{" "}
                  <span className="text-gray-700">{selectedHr.comments}</span>
                </span>
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full justify-between gap-2">
          {role !== "global" && (
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={() => router.push(`/edit-hr?id=${selectedHr?.id}`)}
            >
              Edit
            </AlertDialogAction>
          )}
          <AlertDialogAction className="bg-blue-800 hover:bg-blue-900">
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
