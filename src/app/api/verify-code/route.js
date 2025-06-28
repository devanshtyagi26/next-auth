import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";
import { verifySchema } from "@/schemas/verifySchema";
import { createApiResponse } from "@/lib/apiResponse";

const VerifyUserSchema = z.object({
  userName: userNameValidation,
  code: verifySchema.shape.code,
});

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const result = VerifyUserSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors = result.error.format();
      const messages = [
        ...(formattedErrors.userName?._errors || []),
        ...(formattedErrors.code?._errors || []),
      ];
      return createApiResponse(
        false,
        messages.length ? messages.join(", ") : "Invalid input",
        400
      );
    }

    const { userName, code } = result.data;

    const user = await User.findOne({ userName });

    if (!user) {
      return createApiResponse(false, "User not found", 404);
    }

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    const isCodeValid = user.verifyCode === code;

    if (!isCodeNotExpired) {
      return createApiResponse(
        false,
        "Verification code expired, SignUp again",
        400
      );
    }

    if (!isCodeValid) {
      return createApiResponse(false, "Incorrect verification code", 400);
    }

    user.isVerified = true;
    await user.save();

    return createApiResponse(true, "Account verified successfully", 200);
  } catch (error) {
    return createApiResponse(false, "Error verifying user:", 500, error);
  }
}
