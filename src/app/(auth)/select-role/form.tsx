"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { reloadSession } from "@/lib/auth";
import { defaultPaths } from "@/lib/paths";
import { newUserHandle } from "@/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  role: z.nativeEnum(Role),
});

type FormData = z.infer<typeof FormSchema>;

export function SelectRoleForm() {
  const { data: session, update } = useSession();
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const { mutate: setRoleToUser } = useMutation({
    mutationFn: newUserHandle,
    onSuccess: () => {
      const role = form.getValues().role;
      update({ ...session, user: { ...session!.user, role } });
      reloadSession();
    },
  });
  const onSubmit = async (data: FormData) => {
    const { role } = data;
    setRoleToUser({ role, userId: session!.user.id });
  };

  useEffect(() => {
    if (session && session.user.role) {
      router.push(defaultPaths[session.user.role]);
    }
  }, [session]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Select type of account to continue
        </h1>
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
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !session}
          >
            {form.formState.isSubmitting ? "Loading...." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
