"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addHrRecord } from "@/lib/actions";

export default function AddHr() {
  const [formData, setFormData] = useState({
    hr_name: "",
    volunteer: "",
    incharge: "",
    company: "",
    email: "",
    phone_number: "",
    status: "Pending",
    interview_mode: "Online",
    hr_count: "",
    transport: "",
    address: "",
    internship: "No",
    comments: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
    setError(null);
    setSuccess(false);

    try {
      await addHrRecord(formData);
      setSuccess(true);
      setFormData({
        hr_name: "",
        volunteer: "",
        incharge: "",
        company: "",
        email: "",
        phone_number: "",
        status: "Pending",
        interview_mode: "",
        hr_count: "",
        transport: "",
        address: "",
        internship: "No",
        comments: ""
      });
    } catch (error) {
      setError("An error occurred while adding the HR record. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    (<div className="min-h-screen w-screen p-[75px] bg-blue-50 relative">
      <Card className="mb-6 border-blue-200 shadow-blue-100 rounded-lg">
        <CardHeader className="bg-blue-100 rounded-t-lg mb-4">
          <CardTitle className="text-blue-800 text-center text-3xl font-bold">
            Add New HR Record
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
                  required />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="border-blue-200 focus:ring-blue-500"
                  required />
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
                  required />
              </div>
              <div>
                <Label>Interview Mode</Label>
                <Select
                  value={formData.interview_mode}
                  onValueChange={(value) => handleSelectChange("interview_mode", value)}>
                  <SelectTrigger className="border-blue-200 focus:ring-blue-500">
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
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="border-blue-200 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <Label htmlFor="volunteer">Volunteer</Label>
                <Input
                  id="volunteer"
                  name="volunteer"
                  value={formData.volunteer}
                  onChange={handleChange}
                  className="border-blue-200 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <Label htmlFor="incharge">Incharge</Label>
                <Input
                  id="incharge"
                  name="incharge"
                  value={formData.incharge}
                  onChange={handleChange}
                  className="border-blue-200 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Active">Accepted</SelectItem>
                    <SelectItem value="Inactive">Declined</SelectItem>
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
                  required />
              </div>
              <div>
                <Label htmlFor="transport">Transport</Label>
                <Input
                  id="transport"
                  name="transport"
                  value={formData.transport}
                  onChange={handleChange}
                  className="border-blue-200 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border-blue-200 focus:ring-blue-500"
                  required />
              </div>
              <div>
                <Label htmlFor="internship">Internship</Label>
                <Select
                  value={formData.internship}
                  onValueChange={(value) => handleSelectChange("internship", value)}>
                  <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                    <SelectValue placeholder="Select internship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              disabled={isLoading}>
              {isLoading ? "Adding..." : "Add HR Record"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-6 bg-green-100 border-green-400 text-green-700">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>HR record has been successfully added.</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={() => router.push("/")}
        className="mt-4 bg-white hover:bg-blue-100 text-blue-800 border border-neutral-200 dark:border-neutral-800">
        Back to HR Database
      </Button>
    </div>)
  );
}

