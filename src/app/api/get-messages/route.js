import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { createApiResponse } from "@/lib/apiResponse";

export async function GET(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!session || !sessionUser) {
    return createApiResponse(false, "Not Authenticated", 401);
  }

  const userUuid = sessionUser.uuid;

  try {
    const result = await User.aggregate([
      { $match: { uuid: userUuid } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$uuid",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return createApiResponse(false, "User not found", 404);
    }

    return Response.json(
      {
        success: true,
        messages: result[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    return createApiResponse(false, "Error fetching messages", 500, error);
  }
}
