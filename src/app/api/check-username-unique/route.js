import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      userName: searchParams.get("userName"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const userNameErrors = result.error.format().userName?._error || [];
      return Response.json(
        {
          success: false,
          message:
            userNameErrors?.length > 0
              ? userNameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { userName } = result.data;
    const existingVerifiedUser = await User.findOne({
      userName,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "UserName is already taken",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "UserName is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking UserName", error);
    return Response.json(
      {
        success: false,
        message: "Error checking UserName",
      },
      { status: 500 }
    );
  }
}
