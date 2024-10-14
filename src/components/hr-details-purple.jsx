"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data
const hrData = [
  {
    id: 1,
    addedBy: "John Doe",
    hrName: "Alice Johnson",
    companyName: "Tech Corp",
    email: "alice@techcorp.com",
    number: "+1234567890",
    status: "Active",
    interviewMode: "Online",
    branch: "IT",
    department: "Software Development",
    transport: "Not Required",
    notes: "Excellent communication skills",
  },
  {
    id: 2,
    addedBy: "Jane Smith",
    hrName: "Bob Williams",
    companyName: "Innovate Inc",
    email: "bob@innovateinc.com",
    number: "+1987654321",
    status: "Inactive",
    interviewMode: "In-person",
    branch: "HR",
    department: "Recruitment",
    transport: "Required",
    notes: "Experienced in technical hiring",
  },
  //new data
  {
    id: 3,
    addedBy: "Jane Smith",
    hrName: "Bob Williams",
    companyName: "Innovate Inc",
    email: "bob@innovateinc.com",
    number: "+1987654321",
    status: "Inactive",
    interviewMode: "In-person",
    branch: "HR",
    department: "Recruitment",
    transport: "Required",
    notes: "Experienced in technical hiring",
  },
  {
    id: 4,
    addedBy: "Jane Smith",
    hrName: "Bob Williams",
    companyName: "Innovate Inc",
    email: "bob@innovateinc.com",
    number: "+1987654321",
    status: "Inactive",
    interviewMode: "In-person",
    branch: "HR",
    department: "Recruitment",
    transport: "Required",
    notes: "Experienced in technical hiring",
  },
  {
    id: 6,
    addedBy: "Jane Smith",
    hrName: "Bob Williams",
    companyName: "Innovate Inc",
    email: "bob@innovateinc.com",
    number: "+1987654321",
    status: "Inactive",
    interviewMode: "In-person",
    branch: "HR",
    department: "Recruitment",
    transport: "Required",
    notes: "Experienced in technical hiring",
  },
  {
    id: 7,
    addedBy: "Jane Smith",
    hrName: "Bob Williams",
    companyName: "Innovate Inc",
    email: "bob@innovateinc.com",
    number: "+1987654321",
    status: "Inactive",
    interviewMode: "In-person",
    branch: "HR",
    department: "Recruitment",
    transport: "Required",
    notes: "Experienced in technical hiring",
  },
  {
    id: 8,
    addedBy: "Jane Smith",
    hrName: "Bob Williams",
    companyName: "Innovate Inc",
    email: "bob@innovateinc.com",
    number: "+1987654321",
    status: "Inactive",
    interviewMode: "In-person",
    branch: "HR",
    department: "Recruitment",
    transport: "Required",
    notes: "Experienced in technical hiring",
  },
  {
    id: 9,
    addedBy: "Jane Smith",
    hrName: "Bob Williams",
    companyName: "Innovate Inc",
    email: "bob@innovateinc.com",
    number: "+1987654321",
    status: "Inactive",
    interviewMode: "In-person",
    branch: "HR",
    department: "Recruitment",
    transport: "Required",
    notes: "Experienced in technical hiring",
  },
  {
    id: 10,
    addedBy: "Jane Smith",
    hrName: "Bob Williams",
    companyName: "Innovate Inc",
    email: "bob@innovateinc.com",
    number: "+1987654321",
    status: "Inactive",
    interviewMode: "In-person",
    branch: "HR",
    department: "Recruitment",
    transport: "Required",
    notes: "Experienced in technical hiring",
  },

  // Add more mock data here...
];

export function HrDetailsPurple() {
  const [searchParams, setSearchParams] = useState({
    status: "",
    interview: "",
    branch: "",
    transport: "",
    company: "",
  })

  const handleSearch = () => {
    // Implement search logic here
    console.log("Search params:", searchParams)
  }

  return (
    <div className="min-h-screen w-screen p-[75px] bg-purple-50">
      <Card className="mb-6 border-purple-200 shadow-purple-100 rounded-lg">
        <CardHeader className="bg-purple-100 rounded-t-lg mb-4">
          <CardTitle className="text-purple-800">Search HR Details</CardTitle>
        </CardHeader>
        <CardContent className="bg-white rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, status: value })
              }
            >
              <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, interview: value })
              }
            >
              <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                <SelectValue placeholder="Interview Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="inperson">In-person</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, branch: value })
              }
            >
              <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                setSearchParams({ ...searchParams, transport: value })
              }
            >
              <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                <SelectValue placeholder="Transport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="required">Required</SelectItem>
                <SelectItem value="not-required">Not Required</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Company"
              onChange={(e) =>
                setSearchParams({ ...searchParams, company: e.target.value })
              }
              className="border-purple-200 focus:ring-purple-500"
            />
            <Button
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-100">
              <TableHead className="text-purple-800">Added By</TableHead>
              <TableHead className="text-purple-800">HR Name</TableHead>
              <TableHead className="text-purple-800">Company Name</TableHead>
              <TableHead className="text-purple-800">Email</TableHead>
              <TableHead className="text-purple-800">Number</TableHead>
              <TableHead className="text-purple-800">Status</TableHead>
              <TableHead className="text-purple-800">Interview Mode</TableHead>
              <TableHead className="text-purple-800">Branch</TableHead>
              <TableHead className="text-purple-800">Department</TableHead>
              <TableHead className="text-purple-800">Transport</TableHead>
              <TableHead className="text-purple-800">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hrData.map((hr, index) => (
              <TableRow
                key={hr.id}
                className={index % 2 === 0 ? "bg-purple-50" : "bg-white"}
              >
                <TableCell>{hr.addedBy}</TableCell>
                <TableCell>{hr.hrName}</TableCell>
                <TableCell>{hr.companyName}</TableCell>
                <TableCell>{hr.email}</TableCell>
                <TableCell>{hr.number}</TableCell>
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
                <TableCell>{hr.interviewMode}</TableCell>
                <TableCell>{hr.branch}</TableCell>
                <TableCell>{hr.department}</TableCell>
                <TableCell>{hr.transport}</TableCell>
                <TableCell>{hr.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}