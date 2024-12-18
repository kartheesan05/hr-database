"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchForm({
  onSearch,
  searchParams,
  setSearchParams,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search All Fields
        </Label>
        <Input
          id="search"
          placeholder="Search across all fields..."
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              search: e.target.value.trim(),
            })
          }
        />
      </div>
      <div>
        <Label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </Label>
        <Input
          id="name"
          placeholder="Name"
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              name: e.target.value.trim(),
            })
          }
        />
      </div>
      <div>
        <Label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          placeholder="Phone Number"
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              phoneNumber: e.target.value.trim(),
            })
          }
        />
      </div>
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Interview Mode
        </Label>
        <Select
          id="interviewMode"
          onValueChange={(value) =>
            setSearchParams({
              ...searchParams,
              interview: value === "Both" ? "" : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Interview Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Both">Both</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="In-person">In-person</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Status
        </Label>
        <Select
          id="status"
          onValueChange={(value) =>
            setSearchParams({
              ...searchParams,
              status: value === "All" ? "" : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Not_Called">Not Called</SelectItem>
            <SelectItem value="Email_Sent">Email Sent</SelectItem>
            <SelectItem value="Active">Accepted</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Inactive">Declined</SelectItem>
            <SelectItem value="Blacklisted">Blacklisted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <Button
          onClick={onSearch}
          className="bg-blue-800 hover:bg-blue-900 w-full"
        >
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
    </div>
  );
}
