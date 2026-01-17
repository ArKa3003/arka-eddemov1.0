"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AuthForm,
  AuthDivider,
  AuthError,
} from "@/components/auth/auth-form";
import { SocialButtons } from "@/components/auth/social-buttons";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login page with email/password and OAuth options.
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const redirectTo = searchParams.get("redirect") || "/cases";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(data.email, data.password);
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // TODO: Implement Google OAuth
    console.log("Google sign-in");
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to continue your learning journey"
      footer={
        <p className="text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Create one
          </Link>
        </p>
      }
    >
      {/* Error message */}
      <AuthError message={error ?? undefined} />

      {/* Social buttons */}
      <SocialButtons onGoogleClick={handleGoogleSignIn} />

      <AuthDivider />

      {/* Login form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white",
                "text-slate-900 placeholder:text-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent",
                errors.email
                  ? "border-rose-300 focus:ring-rose-500"
                  : "border-slate-300"
              )}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={cn(
                "w-full pl-10 pr-12 py-2.5 rounded-lg border bg-white",
                "text-slate-900 placeholder:text-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent",
                errors.password
                  ? "border-rose-300 focus:ring-rose-500"
                  : "border-slate-300"
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-rose-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              id="rememberMe"
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              {...register("rememberMe")}
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-slate-600"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthForm>
  );
}
