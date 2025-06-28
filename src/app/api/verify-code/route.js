import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";
import { verifySchema } from "@/schemas/verifySchema";

const VerifyUserSchema = z.object({
  userName: userNameValidation,
  code: verifySchema,
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

      return Response.json(
        {
          success: false,
          message: messages.length ? messages.join(", ") : "Invalid input",
        },
        { status: 400 }
      );
    }

    const { userName, code } = result.data;

    const user = await User.findOne({ userName });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    const isCodeValid = user.verifyCode === code;

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired, SignUp again",
        },
        { status: 400 }
      );
    }

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
