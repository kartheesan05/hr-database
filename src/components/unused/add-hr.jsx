"use client";
import * as React from "react";
import { useCallback, useState } from "react";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { addHrBulk } from "@/lib/actions";

export default function AddHrBulk({
  // 5MB default
  maxSize = 5 * 1024 * 1024,
}) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [duplicates, setDuplicates] = useState(null);
  const [message, setMessage] = useState(null);

  const processCSV = async (file) => {
    const text = await file.text();
    const rows = text.split("\n");
    const headers = rows[0].split(",").map((h) => h.trim());

    // Simulate progress during processing
    setUploadProgress(25);

    const hrData = rows
      .slice(1)
      .filter((row) => row.trim())
      .map((row) => {
        const values = row.split(",").map((v) => v.trim());
        return {
          hr_name: values[0],
          company: values[1],
          phone_number: values[2],
          email: values[3] || "",
        };
      });

    // Update progress before sending to server
    setUploadProgress(50);

    try {
      const result = await addHrBulk(hrData);
      // Update progress after server response
      setUploadProgress(100);
      if (result.duplicates?.length > 0) {
        setDuplicates(result.duplicates);
        setMessage(result.message);
        setFile(null);
      }
      return result;
    } catch (error) {
      console.error("Error processing CSV:", error);
      setError("Failed to process CSV file");
      setUploadProgress(0);
      return null;
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];

      // Reset states
      setError(null);
      setUploadProgress(0);
      setDuplicates(null);

      // Validate file type
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }

      // Validate file size
      if (selectedFile.size > maxSize) {
        setError(
          `File size should be less than ${Math.round(maxSize / 1024 / 1024)}MB`
        );
        return;
      }

      setFile(selectedFile);
    },
    [maxSize]
  );

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const result = await processCSV(file);
      if (result?.success) {
        setError(null);
      } else {
        setError("Failed to process CSV file");
        setUploadProgress(0);
      }
    } catch (err) {
      setError("Error processing CSV file");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
    setUploadProgress(0);
    setUploading(false);
  };

  return (
    <Card className="w-full max-w-md mx-10">
      <CardHeader>
        <CardTitle>Upload CSV</CardTitle>
        <CardDescription>
          Drag and drop your CSV file here or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-neutral-900/5 dark:bg-neutral-50/5"
              : "border-muted-foreground/25",
            (file || error) && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          <UploadCloudIcon className="w-10 h-10 mx-auto mb-4 text-neutral-500 dark:text-neutral-400" />
          <p className="text-sm text-neutral-500 mb-2 dark:text-neutral-400">
            {isDragActive
              ? "Drop your file here"
              : "Drag & drop or click to select"}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Supports: CSV up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/10 text-red-500 text-sm p-3 rounded-lg dark:bg-red-900/10 dark:text-red-900">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 bg-green-500/10 text-green-500 text-sm p-3 rounded-lg dark:bg-green-900/10 dark:text-green-900">
            {message}
          </div>
        )}

        {file && !error && (
          <div className="mt-4 bg-neutral-100 p-3 rounded-lg dark:bg-neutral-800">
            <div className="flex items-center gap-2">
              <FileIcon className="shrink-0 w-4 h-4" />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{file.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {(file.size / 1024).toFixed(1)}KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 w-8 h-8"
                onClick={removeFile}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
            {uploading && <Progress value={uploadProgress} className="mt-2" />}
          </div>
        )}

        {duplicates && duplicates.length > 0 && (
          <CardContent>
            <div className="mt-4 bg-yellow-500/10 p-3 rounded-lg">
              <h3 className="font-medium mb-2">Duplicate Entries Found:</h3>
              <ul className="text-sm space-y-1">
                {duplicates.map((dup, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span>{dup.hr_name}</span>
                    <span className="text-neutral-500">
                      ({dup.phone_number})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-blue-800 hover:bg-blue-900"
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
      </CardFooter>
    </Card>
  );
}
