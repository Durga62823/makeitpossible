"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { registerUser } from "@/app/actions/auth";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuthStore } from "@/lib/stores/auth-store";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";

export function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  const password = watch("password", "");

  const onSubmit = (values: SignUpInput) => {
    startTransition(async () => {
      const result = await registerUser(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message ?? "Account created");
      setAuth({
        status: "unauthenticated",
        user: { name: `${values.firstName} ${values.lastName}`.trim(), email: values.email },
      });
      router.push("/auth/verify-email");
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" placeholder="Avery" {...register("firstName")} />
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" placeholder="Chen" {...register("lastName")} />
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" {...register("password")} autoComplete="new-password" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <PasswordStrengthIndicator password={password} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput id="confirmPassword" {...register("confirmPassword")} autoComplete="new-password" />
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
