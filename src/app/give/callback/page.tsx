"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { giving } from "@/lib/api";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      return;
    }

    giving
      .verifyPaystack(reference)
      .then((res) => {
        if (res.status === "SUCCESS") {
          setStatus("success");
          setMessage("Your giving has been received. Thank you for your generosity!");
        } else {
          setStatus("failed");
          setMessage(res.message || "Payment could not be verified.");
        }
      })
      .catch(() => {
        setStatus("failed");
        setMessage("Unable to verify payment. Please contact support if you were charged.");
      });
  }, [reference]);

  const resolvedStatus = reference ? status : "failed";
  const resolvedMessage = reference
    ? message
    : "No payment reference found.";

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
      <div className="rounded-[8px] border border-gray-border bg-white p-10 text-center max-w-md shadow-sm">
        {resolvedStatus === "verifying" && (
          <>
            <Loader2 className="mx-auto h-14 w-14 text-purple animate-spin mb-4" />
            <h1 className="font-heading text-xl font-bold text-slate mb-2">Verifying Payment</h1>
            <p className="font-body text-sm text-gray-text">Please wait while we confirm your transaction...</p>
          </>
        )}
        {resolvedStatus === "success" && (
          <>
            <CheckCircle className="mx-auto h-14 w-14 text-success mb-4" />
            <h1 className="font-heading text-xl font-bold text-slate mb-2">Payment Successful!</h1>
            <p className="font-body text-sm text-gray-text mb-6">{resolvedMessage}</p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard/giving">
                <Button variant="primary">View Giving History</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">Home</Button>
              </Link>
            </div>
          </>
        )}
        {resolvedStatus === "failed" && (
          <>
            <XCircle className="mx-auto h-14 w-14 text-error mb-4" />
            <h1 className="font-heading text-xl font-bold text-slate mb-2">Payment Not Confirmed</h1>
            <p className="font-body text-sm text-gray-text mb-6">{resolvedMessage}</p>
            <div className="flex gap-3 justify-center">
              <Link href="/give">
                <Button variant="primary">Try Again</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">Home</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
          <Loader2 className="h-8 w-8 text-purple animate-spin" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
