"use client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { verifySelectRoleToken } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SelectRoleForm } from "./form";
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isValid, setIsValid] = useState(false);
  const token = searchParams.get("token");
  useEffect(() => {
    if (!token) {
      router.replace("/");
    } else {
      const res = verifySelectRoleToken(token);
      if (!res) {
        router.replace("/");
      } else {
        setIsValid(true);
      }
    }
  }, [token, router]);

  return !isValid ? <LoadingSpinner /> : <SelectRoleForm />;
}
