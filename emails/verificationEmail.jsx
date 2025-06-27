import * as React from "react";
import { Html, Button } from "@react-email/components";

export function verificationEmail(userName, otp) {
  const { url } = props;

  return (
    <Html lang="en">
      <Head>
        <title>PredictHer - Verify Email</title>
      </Head>
      <Body>
        <p>UserName: {userName}</p>
        <p>OTP: {otp}</p>
      </Body>
      {/* <Button href={url}>Click me</Button> */}
    </Html>
  );
}

export default verificationEmail;
