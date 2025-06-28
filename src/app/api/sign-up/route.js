import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { createApiResponse } from "@/lib/apiResponse";

export async function POST(request) {
  await dbConnect();
  try {
    const { userName, email, password } = await request.json();
    const existingUserVerifiedByUserName = await User.findOne({
      userName,
      isVerified: true,
    });

    if (existingUserVerifiedByUserName) {
      return createApiResponse(false, "Username is already taken", 400);
    }

    const existingUserByEmail = await User.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return createApiResponse(
          false,
          "User already exists with this email",
          400
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCode
    );

    if (!emailResponse.success) {
      return createApiResponse(false, emailResponse.message, 500);
    }
    return createApiResponse(true, "User registered Successfully", 200);
  } catch (error) {
    return createApiResponse(false, "Error Registering User", 500, error);
  }
}
