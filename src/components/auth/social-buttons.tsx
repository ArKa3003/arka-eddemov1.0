// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} SocialButtonsProps
 * @property {() => Promise<void>} [onGoogleClick] - Google sign-in handler
 * @property {() => Promise<void>} [onMicrosoftClick] - Microsoft sign-in handler
 * @property {boolean} [loading] - Loading state
 * @property {string} [className] - Additional CSS classes
 */
export interface SocialButtonsProps {
  onGoogleClick?: () => Promise<void>;
  onMicrosoftClick?: () => Promise<void>;
  loading?: boolean;
  className?: string;
}

/**
 * Social OAuth buttons for authentication.
 */
export function SocialButtons({
  onGoogleClick,
  onMicrosoftClick,
  loading = false,
  className,
}: SocialButtonsProps) {
  const [loadingProvider, setLoadingProvider] = React.useState<string | null>(
    null
  );

  const handleGoogleClick = async () => {
    if (!onGoogleClick) return;
    setLoadingProvider("google");
    try {
      await onGoogleClick();
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleMicrosoftClick = async () => {
    if (!onMicrosoftClick) return;
    setLoadingProvider("microsoft");
    try {
      await onMicrosoftClick();
    } finally {
      setLoadingProvider(null);
    }
  };

  const isLoading = loading || loadingProvider !== null;

  return (
    <div className={cn("grid gap-3", className)}>
      {/* Google */}
      <Button
        type="button"
        variant="default"
        className="w-full h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
        onClick={handleGoogleClick}
        disabled={isLoading}
      >
        {loadingProvider === "google" ? (
          <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <GoogleIcon className="w-5 h-5 mr-2" />
        )}
        Continue with Google
      </Button>

      {/* Microsoft */}
      {onMicrosoftClick && (
        <Button
          type="button"
          variant="default"
          className="w-full h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
          onClick={handleMicrosoftClick}
          disabled={isLoading}
        >
          {loadingProvider === "microsoft" ? (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <MicrosoftIcon className="w-5 h-5 mr-2" />
          )}
          Continue with Microsoft
        </Button>
      )}
    </div>
  );
}

/**
 * Google brand icon
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/**
 * Microsoft brand icon
 */
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022" />
      <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00" />
      <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF" />
      <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900" />
    </svg>
  );
}
