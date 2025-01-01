import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be 8 chars minimum" })
    .trim(),
});

export const AddUserSchema = LoginFormSchema.extend({
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "volunteer", "incharge"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role",
  }),
});

export const HrContactSchema = z.object({
  hr_name: z.string().min(1, "HR name is required"),
  volunteer: z.string().min(1, "Volunteer name is required"),
  incharge: z.string().min(1, "Incharge name is required"),
  company: z.string().min(1, "Company name is required"),
  phone_number: z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  status: z.enum([
    "Pending",
    "Active", 
    "Inactive",
    "Email_Sent",
    "Not_Called",
    "Blacklisted",
    "Not_Reachable",
    "Wrong_Number",
    "Called_Postponed"
  ], {
    required_error: "Status is required"
  }),
  // Optional fields
  email: z.string().email().optional().or(z.literal("")),
  interview_mode: z.enum(["Online", "In-person", "Both", "Not Confirmed"], {
    required_error: "Interview mode is required",
    invalid_type_error: "Invalid interview mode"
  }).optional(),
  hr_count: z.number().int().min(1).default(1),
  transport: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  internship: z.enum(["Yes", "No"]).default("No"),
  comments: z.string().optional().or(z.literal(""))
});
