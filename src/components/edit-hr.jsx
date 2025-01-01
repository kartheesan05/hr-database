"use client";

import { useState, useEffect, Suspense, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getHR, editHR, deleteHR } from "@/lib/actions";
import { HrContactSchema } from "@/lib/definitions";
import { toast } from "sonner";

export default function EditHr() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditHrForm />
    </Suspense>
  );
}

function EditHrForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    hr_name: "",
    volunteer: "",
    incharge: "",
    company: "",
    email: "",
    phone_number: "",
    status: "Not_Called",
    interview_mode: "",
    hr_count: "",
    transport: "",
    address: "",
    internship: "No",
    comments: "",
    volunteer_email: undefined,
    incharge_email: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [availableIncharges, setAvailableIncharges] = useState([]);

  useEffect(() => {
    const fetchHrData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const result = await getHR(id);
        if (result.errors) {
          setErrorState(result.errors);
          return;
        }
        const sanitizedData = Object.fromEntries(
          Object.entries(result.data).map(([key, value]) => [key, value ?? ""])
        );
        setFormData(sanitizedData);
        setAvailableIncharges(result.incharges || []);
      } catch (error) {
        console.log("error", error);
        setErrorState("Failed to load HR data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHrData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value ?? "",
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorState(null);
    setSuccess(false);

    const validatedFields = HrContactSchema.safeParse({
      hr_name: formData.hr_name,
      phone_number: formData.phone_number,
      email: formData.email,
      interview_mode: formData.interview_mode,
      company: formData.company,
      volunteer: formData.volunteer,
      incharge: formData.incharge,
      status: formData.status,
      hr_count: parseInt(formData.hr_count),
      transport: formData.transport,
      address: formData.address,
      internship: formData.internship,
      comments: formData.comments,
    });

    if (validatedFields.data?.address === "07032005") {
      setErrorState("Happy Birthday🥳");
      setIsLoading(false);
      return;
    }

    if (!validatedFields.success) {
      setErrorState(validatedFields.error.flatten().fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = { ...validatedFields.data };
      data.volunteer_email = formData.volunteer_email;
      data.incharge_email = formData.incharge_email;

      startTransition(async () => {
        const result = await editHR(id, data);
        if (result.errors) {
          setErrorState(result.errors);
          return;
        }
        setSuccess(true);
      });
      // router.push("/");
    } catch (error) {
      setErrorState(
        "An error occurred while updating the HR record. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window?.confirm(
        "Are you sure you want to delete this HR record? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setErrorState(null);

    try {
      startTransition(async () => {
        const result = await deleteHR(id);
        if (result.errors) {
          setErrorState(result.errors);
          return;
        }
        toast.warning("HR record deleted successfully");
        router.push("/");
      });
    } catch (error) {
      setErrorState("An error occurred while deleting the HR record.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-screen p-[75px] bg-blue-50 relative">
        <Card className="mb-6 border-blue-200 shadow-blue-100 rounded-lg">
          <CardHeader className="bg-blue-100 rounded-t-lg mb-4">
            <CardTitle className="text-blue-800 text-center text-3xl font-bold">
              Edit HR Record
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hr_name">HR Name</Label>
                  <Input
                    id="hr_name"
                    name="hr_name"
                    value={formData.hr_name}
                    onChange={handleChange}
                    className="border-blue-200 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="border-blue-200 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-blue-200 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label>Interview Mode</Label>
                  <Select
                    value={formData.interview_mode}
                    onValueChange={(value) =>
                      handleSelectChange("interview_mode", value)
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder="Interview Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Confirmed">
                        Not Confirmed
                      </SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="In-person">In-person</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="border-blue-200 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="volunteer">Member</Label>
                  <Input
                    id="volunteer"
                    name="volunteer"
                    value={formData.volunteer}
                    onChange={handleChange}
                    className="border-blue-200 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="incharge">Incharge</Label>
                  <Input
                    id="incharge"
                    name="incharge"
                    value={formData.incharge}
                    onChange={handleChange}
                    className="border-blue-200 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Active">Accepted</SelectItem>
                      <SelectItem value="Inactive">Declined</SelectItem>
                      <SelectItem value="Email_Sent">Email Sent</SelectItem>
                      <SelectItem value="Not_Called">Not Called</SelectItem>
                      <SelectItem value="Blacklisted">Blacklisted</SelectItem>
                      <SelectItem value="Not_Reachable">
                        Not Reachable
                      </SelectItem>
                      <SelectItem value="Wrong_Number">Wrong Number</SelectItem>
                      <SelectItem value="Called_Postponed">
                        Called Postponed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hr_count">HR Count</Label>
                  <Input
                    id="hr_count"
                    name="hr_count"
                    type="number"
                    value={formData.hr_count}
                    onChange={handleChange}
                    className="border-blue-200 focus:ring-blue-500"
                    min={1}
                  />
                </div>
                <div>
                  <Label htmlFor="transport">Transport</Label>
                  <Input
                    id="transport"
                    name="transport"
                    value={formData.transport}
                    onChange={handleChange}
                    className="border-blue-200 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border-blue-200 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="internship">Internship</Label>
                  <Select
                    value={formData.internship}
                    onValueChange={(value) =>
                      handleSelectChange("internship", value)
                    }
                  >
                    <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder="Select internship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.volunteer_email !== undefined && (
                  <>
                    <div>
                      <Label htmlFor="volunteer_email">Member Email</Label>
                      <Input
                        id="volunteer_email"
                        name="volunteer_email"
                        value={formData.volunteer_email}
                        onChange={handleChange}
                        className="border-blue-200 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="incharge_email">Incharge Email</Label>
                      <Select
                        value={formData.incharge_email}
                        onValueChange={(value) =>
                          handleSelectChange("incharge_email", value)
                        }
                      >
                        <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                          <SelectValue placeholder="Select incharge email" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIncharges.map((email) => (
                            <SelectItem key={email} value={email}>
                              {email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="border-blue-200 focus:ring-blue-500 min-h-[100px]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900"
                disabled={isLoading || isPending}
              >
                {isLoading || isPending ? "Updating..." : "Update HR Record"}
              </Button>
            </form>
          </CardContent>
        </Card>
        {errorState && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-100 border-red-400 text-red-700"
          >
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {typeof errorState === "string"
                ? errorState
                : Object.values(errorState).flat().join(", ")}
            </AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 bg-green-100 border-green-400 text-green-700">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              HR record has been successfully updated.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex gap-4 mt-4">
          <Button
            onClick={() => router.push("/")}
            className="bg-white hover:bg-blue-100 text-blue-800 border border-neutral-200 dark:border-neutral-800"
          >
            Back to HR Database
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading || isPending}
          >
            Delete HR Record
          </Button>
        </div>
      </div>
    </>
  );
}
