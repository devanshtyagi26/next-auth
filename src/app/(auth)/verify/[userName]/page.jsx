"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import axios from "axios";
import { verifySchema } from "@/schemas/verifySchema";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data) => {
    try {
      if (!params.userName) {
        toast.error("Username is missing in the URL.");
        return;
      }

      const response = await axios.post("/api/verify-code", {
        userName: params.userName,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace("sign-in");
    } catch (error) {
      console.error("Error in sign up", error);
      const axiosError = error;

      let errorMessage = axiosError.response?.data.message;
      toast.error("Signup Failed" + errorMessage);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="code" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default VerifyAccount;
