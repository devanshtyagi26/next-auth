"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function SignUpPage() {
  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });
  const debouncedCheckUserName = useDebounceCallback(async (value) => {
    if (value) {
      setIsCheckingUserName(true);
      setUserNameMessage("");
      try {
        const response = await axios.get(
          `/api/check-username-unique?userName=${value}`
        );
        setUserNameMessage(response.data.message);
      } catch (error) {
        const axiosError = error;
        setUserNameMessage(
          axiosError.response?.data.message ?? "Error checking userName"
        );
      } finally {
        setIsCheckingUserName(false);
      }
    }
  }, 300);

  //   useEffect(() => {
  //     const checkUniqueUserName = async () => {
  //       if (userName) {
  //         setIsCheckingUserName(true);
  //         setUserNameMessage("");

  //         try {
  //           const response = await axios.get(
  //             `/api/check-username-unique?userName=${userName}`
  //           );
  //           let message = response.data.message;
  //           setUserNameMessage(message);
  //         } catch (error) {
  //           const axiosError = error;
  //           setUserNameMessage(
  //             axiosError.response?.data.message ?? "Error checking userName"
  //           );
  //         } finally {
  //           setIsCheckingUserName(false);
  //         }
  //       }
  //     };
  //     checkUniqueUserName();
  //   }, [userName]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast("Success" + response.data.message);
      router.replace(`/verify/${userName}`);
    } catch (error) {
      console.error("Error in sign up", error);
      const axiosError = error;

      let errorMessage = axiosError.response?.data.message;
      toast("Signup Failed" + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="userName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>UserName</FormLabel>
                <FormControl>
                  <Input
                    placeholder="UserName"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUserName(e.target.value); // optional if you still need this state
                      debouncedCheckUserName(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                {isCheckingUserName ? (
                  <p className="text-sm text-muted-foreground">
                    Checking username...
                  </p>
                ) : (
                  userNameMessage && (
                    <p
                      className={`text-sm ${
                        userNameMessage === "UserName is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {userNameMessage}
                      <Loader2 className="animate-spin" />
                    </p>
                  )
                )}

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
              </>
            ) : (
              "SignUp"
            )}
          </Button>
        </form>
      </Form>
      <p>
        <Link href="/signin">SignIn</Link>
      </p>
    </div>
  );
}

export default SignUpPage;
