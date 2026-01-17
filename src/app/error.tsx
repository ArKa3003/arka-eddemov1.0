"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="mt-4 text-lg">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Try again
      </button>
    </div>
  );
}