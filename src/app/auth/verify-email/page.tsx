"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { auth } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    const verify = async () => {
      try {
        await auth.verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified successfully. You can now log in.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Invalid or expired verification token. Please try registering again."
        );
      }
    };

    verify();
  }, [token]);

  const resolvedStatus = token ? status : "error";
  const resolvedMessage = token
    ? message
    : "No verification token provided.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white px-4">
      <div className="w-full max-w-md rounded-[8px] border border-gray-border bg-white p-8 shadow-sm text-center">
        {resolvedStatus === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 text-purple animate-spin mb-4" />
            <h2 className="font-heading text-xl font-bold text-slate">
              Verifying your email...
            </h2>
            <p className="mt-2 font-body text-sm text-gray-text">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {resolvedStatus === "success" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
            <h2 className="font-heading text-xl font-bold text-success">
              Email Verified!
            </h2>
            <p className="mt-2 font-body text-sm text-gray-text">{resolvedMessage}</p>
            <Link href="/auth/login" className="mt-6 inline-block">
              <Button variant="primary">Go to Login</Button>
            </Link>
          </>
        )}

        {resolvedStatus === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-error mb-4" />
            <h2 className="font-heading text-xl font-bold text-error">
              Verification Failed
            </h2>
            <p className="mt-2 font-body text-sm text-gray-text">{resolvedMessage}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/auth/signup">
                <Button variant="primary" className="w-full">
                  Register Again
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-purple animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
