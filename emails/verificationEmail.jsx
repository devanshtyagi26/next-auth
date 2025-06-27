import * as React from "react";
import { Html, Head, Body, Text, Button } from "@react-email/components";

export function verificationEmail(userName, otp) {
  return (
    <Html lang="en">
      <Head>
        <title>PredictHer - Verify Email</title>
      </Head>
      <Body>
        <Text>UserName: {userName}</Text>
        <Text>OTP: {otp}</Text>
      </Body>
      {/* <Button href={url}>Click me</Button> */}
    </Html>
  );
}

export default verificationEmail;
