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

export default function SearchForm({ onSearch, searchParams, setSearchParams }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          className="border-blue-200 focus:ring-blue-500"
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
          className="border-blue-200 focus:ring-blue-500"
        />
      </div>
      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </Label>
        <Input
          id="email"
          placeholder="Email"
          onChange={(e) =>
            setSearchParams({
              ...searchParams,
              email: e.target.value.trim(),
            })
          }
          className="border-blue-200 focus:ring-blue-500"
        />
      </div>
      <div>
        <Label
          className="block text-sm font-medium text-gray-700"
        >
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
        <Label
          htmlFor="company"
          className="block text-sm font-medium text-gray-700"
        >
          Company
        </Label>
        <Input
          id="company"
          placeholder="Company"
          onChange={(e) =>
            setSearchParams({ ...searchParams, company: e.target.value })
          }
          className="border-blue-200 focus:ring-blue-500"
        />
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
