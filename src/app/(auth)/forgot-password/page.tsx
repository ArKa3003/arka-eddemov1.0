"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  AuthForm,
  AuthError,
} from "@/components/auth/auth-form";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

/**
 * Forgot password form validation schema
 */
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot password page with email input and success state.
 */
export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          {/* Success message */}
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
            Check your email
          </h1>
          <p className="text-slate-600 mb-8">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-slate-900">{submittedEmail}</span>
          </p>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-left mb-8">
            <p className="text-sm text-slate-600">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setIsSuccess(false)}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                try another email address
              </button>
            </p>
          </div>

          {/* Back to login */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <AuthForm
            title="Reset your password"
            subtitle="Enter your email and we'll send you a reset link"
            footer={
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            }
          >
            {/* Error message */}
            <AuthError message={error ?? undefined} />

            {/* Forgot password form */}
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
                  <p className="mt-1 text-sm text-rose-600">
                    {errors.email.message}
                  </p>
                )}
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
                  "Send reset link"
                )}
              </Button>
            </form>
          </AuthForm>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
