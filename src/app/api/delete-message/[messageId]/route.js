import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { createApiResponse } from "@/lib/apiResponse";

export async function DELETE(request, { params }) {
  const messageId = params.messageId;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!session || !sessionUser) {
    return createApiResponse(false, "Not Authenticated", 401);
  }
  try {
    const updateResult = await User.updateOne(
      { uuid: sessionUser.uuid },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updateResult.modifiedCount == 0) {
      return createApiResponse(false, "Message not found", 404);
    }
    return createApiResponse(true, "Message Deleted", 200);
  } catch (error) {
    return createApiResponse(false, "Error Deleting Message", 500, error);
  }
}
