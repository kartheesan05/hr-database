"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUser } from "@/lib/actions";
import { useActionState } from "react";
import { useState } from "react";

export default function AddUser() {
  const [state, formAction, isPending] = useActionState(addUser, {});
  const [selectedRole, setSelectedRole] = useState("");

  const handleSubmit = async (formData) => {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
      inchargeEmail: formData.get("inchargeEmail"),
    };
    console.log("data", data);
    await formAction(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Add User
          </CardTitle>
          <CardDescription className="text-center">
            Enter the details to add a new user
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter a strong password"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                name="role" 
                required 
                disabled={isPending}
                onValueChange={(value) => setSelectedRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="incharge">In Charge</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedRole === "volunteer" && (
              <div className="space-y-2">
                <Label htmlFor="inchargeEmail">Incharge Email</Label>
                <Input
                  id="inchargeEmail"
                  name="inchargeEmail"
                  type="email"
                  placeholder="incharge@example.com"
                  required
                  disabled={isPending}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {state.errors && (
              <div className="text-red-500 text-sm text-center">
                {typeof state.errors === 'object' 
                  ? Object.values(state.errors).join(', ')
                  : state.errors}
              </div>
            )}
            {state.success && (
              <div className="text-green-500 text-sm text-center">
                {"User added successfully"}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white"
              disabled={isPending}
            >
              {isPending ? "Adding user..." : "Add User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
