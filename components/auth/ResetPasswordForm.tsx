"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { resetPassword } from "@/app/actions/password";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { useAuthStore } from "@/lib/stores/auth-store";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const resetAuth = useAuthStore((state) => state.reset);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const password = watch("password", "");

  const onSubmit = (values: ResetPasswordInput) => {
    startTransition(async () => {
      const result = await resetPassword(token, values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Password updated. Please log in.");
      resetAuth();
      router.push("/auth/login");
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <PasswordInput id="password" autoComplete="new-password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>
      <PasswordStrengthIndicator password={password} />
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput id="confirmPassword" autoComplete="new-password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Updating password..." : "Update password"}
      </Button>
    </form>
  );
}
