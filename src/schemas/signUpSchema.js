import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "UserName must be atleast 2 Characters")
  .max(20, "UserName must be atmost 20 Characters")
  .regex(/^[a-zA-Z0-9]+$/, "Username must not contain any special character");

export const signUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
