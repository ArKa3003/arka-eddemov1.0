// @ts-nocheck
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Building, Check, X } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  AuthForm,
  AuthDivider,
  AuthError,
} from "@/components/auth/auth-form";
import { SocialButtons } from "@/components/auth/social-buttons";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

/**
 * Password requirements
 */
const passwordRequirements = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

/**
 * Register form validation schema
 */
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
    role: z.enum(["student", "resident", "attending"], {
      required_error: "Please select your role",
    }),
    institution: z.string().optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register page with full registration form.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
      institution: "",
      acceptTerms: undefined,
    },
  });

  const password = watch("password", "");

  // Calculate password strength
  const passedRequirements = passwordRequirements.filter((req) =>
    req.test(password)
  );
  const strengthPercentage = (passedRequirements.length / passwordRequirements.length) * 100;

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await signUp(data.email, data.password);
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
      title="Create your account"
      subtitle="Start mastering medical imaging appropriateness"
      footer={
        <p className="text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {/* Error message */}
      <AuthError message={error ?? undefined} />

      {/* Social buttons */}
      <SocialButtons onGoogleClick={handleGoogleSignIn} />

      <AuthDivider />

      {/* Register form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Dr. Jane Smith"
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white",
                "text-slate-900 placeholder:text-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent",
                errors.fullName
                  ? "border-rose-300 focus:ring-rose-500"
                  : "border-slate-300"
              )}
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-rose-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

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
              placeholder="you@hospital.edu"
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
              autoComplete="new-password"
              placeholder="Create a strong password"
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

          {/* Password strength indicator */}
          {password && (
            <div className="mt-2 space-y-2">
              {/* Strength bar */}
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    strengthPercentage <= 25 && "bg-rose-500",
                    strengthPercentage > 25 && strengthPercentage <= 50 && "bg-amber-500",
                    strengthPercentage > 50 && strengthPercentage <= 75 && "bg-cyan-500",
                    strengthPercentage > 75 && "bg-emerald-500"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${strengthPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Requirements checklist */}
              <div className="grid grid-cols-2 gap-1">
                {passwordRequirements.map((req) => {
                  const passed = req.test(password);
                  return (
                    <div
                      key={req.id}
                      className={cn(
                        "flex items-center gap-1.5 text-xs",
                        passed ? "text-emerald-600" : "text-slate-400"
                      )}
                    >
                      {passed ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                      {req.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              className={cn(
                "w-full pl-10 pr-12 py-2.5 rounded-lg border bg-white",
                "text-slate-900 placeholder:text-slate-400",
                "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent",
                errors.confirmPassword
                  ? "border-rose-300 focus:ring-rose-500"
                  : "border-slate-300"
              )}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-rose-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Role
          </label>
          <select
            id="role"
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border bg-white",
              "text-slate-900",
              "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent",
              errors.role
                ? "border-rose-300 focus:ring-rose-500"
                : "border-slate-300"
            )}
            {...register("role")}
          >
            <option value="">Select your role</option>
            <option value="student">Medical Student</option>
            <option value="resident">Resident Physician</option>
            <option value="attending">Attending Physician</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-rose-600">{errors.role.message}</p>
          )}
        </div>

        {/* Institution (optional) */}
        <div>
          <label
            htmlFor="institution"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Institution{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="institution"
              type="text"
              placeholder="University Hospital"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              {...register("institution")}
            />
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3">
          <input
            id="acceptTerms"
            type="checkbox"
            className={cn(
              "mt-1 w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500",
              errors.acceptTerms && "border-rose-300"
            )}
            {...register("acceptTerms")}
          />
          <label htmlFor="acceptTerms" className="text-sm text-slate-600">
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-rose-600">{errors.acceptTerms.message}</p>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthForm>
  );
}
