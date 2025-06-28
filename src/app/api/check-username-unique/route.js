import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";
import { createApiResponse } from "@/lib/apiResponse";

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
      return createApiResponse(
        false,
        userNameErrors?.length > 0
          ? userNameErrors.join(", ")
          : "Invalid query parameters",
        400
      );
    }

    const { userName } = result.data;
    const existingVerifiedUser = await User.findOne({
      userName,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return createApiResponse(false, "UserName is already taken", 400);
    }
    return createApiResponse(true, "UserName is unique", 200);
  } catch (error) {
    return createApiResponse(false, "Error checking UserName", 500, error);
  }
}
