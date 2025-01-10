"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Papa from "papaparse";
import { addHrBulk } from "@/lib/actions";
import { toast } from "sonner";

const fileInputStyles = {
  container: "flex flex-col items-center justify-center space-y-4 h-full",
  hiddenInput: "hidden",
  customButton:
    "bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded cursor-pointer transition-colors",
  label: "text-sm text-gray-600 mt-2",
};

function CsvUpload() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  });
  const [parsedRecords, setParsedRecords] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== "text/csv") {
      setError("Please upload a valid CSV file");
      return;
    }
    setFile(selectedFile);
    setError(null);

    // Trigger upload immediately after file selection
    parseCsv(selectedFile);
  };

  const parseCsv = (selectedFile) => {
    const fileToUse = selectedFile || file;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setValidationErrors([]);

    Papa.parse(fileToUse, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        return header.replace("*", "").trim();
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          // console.error("Parse errors:", results.errors);
          setError(
            `CSV parsing errors check csv format: ${results.errors
              .map((e) => e.message)
              .join(", ")}`
          );
          setIsLoading(false);
          return;
        }


        const records = [];
        const stats = { total: results.data.length, success: 0, failed: 0 };
        let errorMessages = [];

        for (const row of results.data) {
          try {
            // Skip empty rows
            if (!Object.values(row).some((value) => value)) {
              continue;
            }

            // Clean up field names
            const cleanRow = {};
            Object.entries(row).forEach(([key, value]) => {
              const cleanKey = key.replace(/\s+/g, "").toLowerCase();
              cleanRow[cleanKey] = value?.toString().trim() || "";
            });

            // Validate mandatory fields and phone number
            const mandatoryFields = ["hr_name", "phone_number", "company"];
            const missingFields = mandatoryFields.filter(
              (field) => !cleanRow[field]
            );

            // Validate phone number
            const phoneNumber = cleanRow.phone_number.replace(/\D/g, "");
            if (phoneNumber.length !== 10) {
              const error = `Invalid phone number for HR: ${
                cleanRow.hr_name || "Unknown"
              }. Must be exactly 10 digits.`;
              errorMessages.push(error);
              stats.failed++;
              continue;
            }

            if (missingFields.length > 0) {
              const error = `Missing mandatory fields: ${missingFields.join(
                ", "
              )} for HR: ${cleanRow.hr_name || "Unknown"}`;
              errorMessages.push(error);
              stats.failed++;
              continue;
            }

            const record = {
              hr_name: cleanRow.hr_name.trim(),
              phone_number: cleanRow.phone_number.toString().trim(),
              company: cleanRow.company.trim(),
              email: (cleanRow.email || "").trim(),
            };

            records.push(record);
            stats.success++;
          } catch (error) {
            const errorMessage = `Error processing row for HR: ${
              row.hr_name || "Unknown"
            } - ${error.message}`;
            console.error(errorMessage);
            errorMessages.push(errorMessage);
            stats.failed++;
          }
        }

        setParsedRecords(records);
        setUploadStats(stats);
        setValidationErrors(errorMessages);
        setIsLoading(false);
      },
      error: (error) => {
        setError("Error parsing CSV file: " + error.message);
        setIsLoading(false);
      },
    });
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    if (parsedRecords.length === 0) {
      setError("No records to upload");
      setIsLoading(false);
      return;
    }
    const result = await addHrBulk(parsedRecords);
    setResult(result);
    setIsLoading(false);
  };

  const handleDownloadTemplate = () => {
    const headers = ["hr_name*", "phone_number*", "company*", "email"];

    const exampleData = [
      {
        "hr_name*": "HR Name",
        "phone_number*": "1234567890",
        "company*": "Company Name",
        email: "",
      },
    ];

    const csv = Papa.unparse({
      fields: headers,
      data: exampleData,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "hr_contacts_template.csv";
    link.click();
    toast.success("CSV template downloaded successfully");
  };

  const downloadDuplicates = (duplicates) => {
    const csv = Papa.unparse({
      fields: Object.keys(duplicates[0]),
      data: duplicates,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "hr_contacts_duplicates.csv";
    link.click();
    toast.success("Duplicates downloaded successfully");
  };

  const clearFile = () => {
    // Reset the file input element
    const fileInput = document.getElementById("file-upload");
    if (fileInput) {
      fileInput.value = "";
    }

    setFile(null);
    setError(null);
    setResult(null);
    setParsedRecords([]);
    setValidationErrors([]);
    setUploadStats({ total: 0, success: 0, failed: 0 });
  };

  return (
    <>
      <Card className=" shadow-blue-100 rounded-xl max-w-[26.5rem] mx-auto w-full overflow-hidden">
        <CardHeader className="bg-blue-100 rounded-t-lg">
          <CardTitle className="text-blue-800 text-center text-3xl font-bold">
            Upload HR Records
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6 rounded-b-xl">
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-12 h-48">
              <div className={fileInputStyles.container}>
                <div className="text-center">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className={fileInputStyles.hiddenInput}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={fileInputStyles.customButton}
                  >
                    Choose CSV File
                  </label>
                  {file && (
                    <div className="flex items-center gap-2 justify-center mt-2">
                      <p className={fileInputStyles.label}>{file.name}</p>
                      <button
                        onClick={clearFile}
                        className="text-gray-500 hover:text-gray-700 flex items-center"
                        title="Clear file"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleDownloadTemplate}
                className="bg-green-600 hover:bg-green-700"
                disabled={file}
              >
                Download CSV Template
              </Button>

              <Button
                onClick={handleUpload}
                disabled={!file || isLoading || validationErrors.length > 0}
                className="bg-blue-800 hover:bg-blue-900"
              >
                {isLoading ? "Uploading..." : "Upload CSV"}
              </Button>
            </div>

            {validationErrors.length > 0 && (
              <Alert
                variant="destructive"
                className="bg-red-100 border-red-400 text-red-700"
              >
                <AlertTitle>Validation Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-100 border-red-400 text-red-700"
              >
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result?.success && (
              <Alert className="bg-green-100 border-green-400 text-green-700">
                <AlertTitle>Upload Complete</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}

            {result?.errors && result.errors.length > 0 && (
              <Alert
                variant="destructive"
                className="bg-red-100 border-red-400 text-red-700"
              >
                <AlertTitle>Upload Errors</AlertTitle>
                <AlertDescription>{result.errors.join(", ")}</AlertDescription>
              </Alert>
            )}

            {result?.duplicates && result.duplicates.length > 0 && (
              <Button
                onClick={() => downloadDuplicates(result.duplicates)}
                className="bg-yellow-500 hover:bg-yellow-600 mt-2 w-full"
              >
                Download {result.duplicates.length} Duplicate Records
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default CsvUpload;
