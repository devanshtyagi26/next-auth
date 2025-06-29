import User from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { createApiResponse } from "@/lib/apiResponse";

export async function POST(request) {
  await dbConnect();
  const { userName, content } = await request.json();

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return createApiResponse(false, "User Not Found", 404);
    }
    if (!user.isAcceptingMessage) {
      return createApiResponse(false, "User Not Accepting Messages", 403);
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage);
    await user.save();

    return createApiResponse(true, "Message sent successfully", 200);
  } catch (error) {
    return (createApiResponse(false, "Error adding Messages", 500), error);
  }
}
