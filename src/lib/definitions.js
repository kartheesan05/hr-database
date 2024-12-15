import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be 8 chars minimum" })
    .trim(),
});

export const AddUserSchema = LoginFormSchema.extend({
  role: z.enum(["admin", "volunteer", "incharge"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role",
  }),
});
