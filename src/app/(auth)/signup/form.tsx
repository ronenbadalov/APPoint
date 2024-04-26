"use client";

import googleLogoIcon from "@/assets/google-logo.svg";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { defaultPaths } from "@/lib/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
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

  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  role: z.nativeEnum(Role),
});

type FormData = z.infer<typeof FormSchema>;

export default function FormPage() {
  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: FormData) => {
    const { email, password, name, role } = data;
    try {
      const response: any = await signIn("signup", {
        email,
        password,
        name,
        role,
        redirect: false,
      });
      if (!response?.error) {
        router.push(defaultPaths[role]);
        router.refresh();
      }

      if (!response.ok) {
        throw new Error(response.error);
      }
      toast({ title: "Successfully signed up" });
    } catch (error: any) {
      toast({ title: "An error occurred", description: error.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Join APPoint</h1>
        <p className="text-sm text-muted-foreground">
          Create an account to book appointments with your favorite businesses
          or to manage your business appointments.
        </p>
        <FormField
          control={form.control}
          name="email"
          data-lpignore
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
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
          data-lpignore
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
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
        <FormField
          control={form.control}
          name="name"
          data-lpignore
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your full name"
                  {...field}
                  type="text"
                />
              </FormControl>
              {errors.password && (
                <FormMessage>{errors.password.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                What type of account would you like to create?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={Role.CUSTOMER} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      I&apos;m a customer
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={Role.BUSINESS} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      I&apos;m a business owner
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid">
          <Button type="submit">Submit</Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or join with
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
          Already have an account?{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
}
