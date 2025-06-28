import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { createApiResponse } from "@/lib/apiResponse";

export async function POST(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return createApiResponse({
      success: false,
      message: "Not Authenticated",
      status: 401,
    });
  }

  const userUuid = user.uuid;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uuid: userUuid },
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return createApiResponse({
        success: false,
        message: "Failed to update user",
        status: 404,
      });
    }

    return createApiResponse({
      success: true,
      message: "Message acceptance status updated",
      status: 200,
    });
  } catch (error) {
    return createApiResponse({
      success: false,
      message: "Failed to update user status",
      status: 500,
      error,
    });
  }
}

export async function GET(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return createApiResponse({
      success: false,
      message: "Not Authenticated",
      status: 401,
    });
  }

  const userUuid = user.uuid;

  try {
    const foundUser = await User.findOne({ uuid: userUuid });

    if (!foundUser) {
      return createApiResponse({
        success: false,
        message: "User not found",
        status: 404,
      });
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    return createApiResponse({
      success: false,
      message: "Error in getting message acceptance status",
      status: 500,
      error,
    });
  }
}
