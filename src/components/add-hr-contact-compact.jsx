"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function AddHrContactCompact() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    emailId: "",
    number: "",
    status: "",
    interviewPreference: "",
    hrCount: "",
    departmentPreference: [],
    transportPreference: "",
    branchPreference: "",
    internship: false,
    extraComments: "",
    address: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (value) => {
    setFormData((prev) => {
      const updatedDepartments = prev.departmentPreference.includes(value)
        ? prev.departmentPreference.filter((dep) => dep !== value)
        : [...prev.departmentPreference, value]
      return { ...prev, departmentPreference: updatedDepartments }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl border-purple-200 rounded-lg shadow-md">
        <CardHeader className="bg-purple-100 py-4 rounded-t-lg">
          <CardTitle className="text-xl font-bold text-purple-800">Add HR Contact</CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-4 rounded-b-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-purple-700 text-sm">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="border-purple-200 h-8"
                  required />
              </div>
              <div>
                <Label htmlFor="companyName" className="text-purple-700 text-sm">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="border-purple-200 h-8"
                  required />
              </div>
              <div>
                <Label htmlFor="emailId" className="text-purple-700 text-sm">Email ID</Label>
                <Input
                  id="emailId"
                  name="emailId"
                  type="email"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  className="border-purple-200 h-8"
                  required />
              </div>
              <div>
                <Label htmlFor="number" className="text-purple-700 text-sm">Number</Label>
                <Input
                  id="number"
                  name="number"
                  type="tel"
                  value={formData.number}
                  onChange={handleInputChange}
                  className="border-purple-200 h-8"
                  required />
              </div>
              <div>
                <Label htmlFor="status" className="text-purple-700 text-sm">Status</Label>
                <Select
                  name="status"
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
                  <SelectTrigger className="border-purple-200 h-8">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interviewPreference" className="text-purple-700 text-sm">Interview Preference</Label>
                <Select
                  name="interviewPreference"
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, interviewPreference: value }))}>
                  <SelectTrigger className="border-purple-200 h-8">
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inperson">In-person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hrCount" className="text-purple-700 text-sm">HR Count</Label>
                <Input
                  id="hrCount"
                  name="hrCount"
                  type="number"
                  value={formData.hrCount}
                  onChange={handleInputChange}
                  className="border-purple-200 h-8"
                  required />
              </div>
              <div>
                <Label className="text-purple-700 text-sm">Department Preference</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["IT", "HR", "Finance", "Marketing", "Sales", "Operations", "Research & Development", "Customer Service", "Legal", "Engineering"].map((dep) => (
                    <div key={dep} className="flex items-center space-x-2">
                      <Checkbox
                        id={dep}
                        checked={formData.departmentPreference.includes(dep)}
                        onCheckedChange={() => handleCheckboxChange(dep)} />
                      <label htmlFor={dep} className="text-xs text-gray-700">{dep}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="transportPreference" className="text-purple-700 text-sm">Transport Preference</Label>
                <Select
                  name="transportPreference"
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, transportPreference: value }))}>
                  <SelectTrigger className="border-purple-200 h-8">
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="required">Required</SelectItem>
                    <SelectItem value="not-required">Not Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="branchPreference" className="text-purple-700 text-sm">Branch Preference</Label>
                <Select
                  name="branchPreference"
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, branchPreference: value }))}>
                  <SelectTrigger className="border-purple-200 h-8">
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Branch</SelectItem>
                    <SelectItem value="satellite">Satellite Office</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="internship"
                  checked={formData.internship}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, internship: checked }))} />
                <Label htmlFor="internship" className="text-purple-700 text-sm">Internship Available</Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="extraComments" className="text-purple-700 text-sm">Extra Comments</Label>
                <Textarea
                  id="extraComments"
                  name="extraComments"
                  value={formData.extraComments}
                  onChange={handleInputChange}
                  className="border-purple-200"
                  rows={5} />
              </div>
              <div>
                <Label htmlFor="address" className="text-purple-700 text-sm">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border-purple-200"
                  rows={5} />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Add HR Contact
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
