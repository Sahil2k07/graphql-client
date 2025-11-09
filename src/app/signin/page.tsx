"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SigninPage() {
  const [payload] = useState({
    email: "testuser@example.com",
    password: "supersecure123",
  });

  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: payload.email,
        password: payload.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setError(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <button
        type="button"
        onClick={handleSignIn}
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Sign In
      </button>

      {error && (
        <div className="p-4 mt-4 text-sm text-left bg-red-100 text-red-700 rounded-md w-[400px]">
          {error}
        </div>
      )}
    </div>
  );
}
