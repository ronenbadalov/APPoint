"use client";

import googleLogoIcon from "@/assets/google-logo.svg";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;

    try {
      const response: any = await signIn("login", {
        email,
        password,
        redirect: false,
      });
      if (!response?.error) {
        router.push("/");
        router.refresh();
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      toast({ title: "Login Successful" });
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to access your account.
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} type="text" />
              </FormControl>
              {errors.email && (
                <FormMessage>{errors.email.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter password"
                  {...field}
                  type="password"
                />
              </FormControl>
              {errors.password && (
                <FormMessage>{errors.password.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <div className="grid">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Loading...." : "Login"}
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid">
          <Button type="button" onClick={() => signIn("google")}>
            <Image
              priority
              src={googleLogoIcon}
              alt="Google Logo"
              width={16}
              height={16}
              className="mr-2"
            />
            Google
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/signup"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}
