import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(email, userName, verifyCode) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "PredictHer | Verification Code",
      react: verificationEmail(userName, verifyCode),
    });
    return { success: true, message: "Verification Email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send Verification Email" };
  }
}
