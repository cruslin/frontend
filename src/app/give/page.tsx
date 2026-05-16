"use client";

import { useState } from "react";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { useToast } from "@/components/ui/Toast";
import { FadeIn, ScaleIn } from "@/components/ui/Motion";
import { Heart, CreditCard, Building, Copy, Check } from "lucide-react";
import { giving } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function GivePage() {
  const { success, error } = useToast();

  const [category, setCategory] = useState("SOW_A_SEED");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "bank">("online");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bankAccounts = [
    {
      label: "Main Account",
      bank: "Zenith Bank Plc.",
      name: "The Ecclesia Embassy",
      number: "1014839248",
    },
    {
      label: "Gilgal Camp Account",
      bank: "Zenith Bank Plc.",
      name: "The Ecclesia Embassy Gilgal",
      number: "1014915517",
    },
    {
      label: "Domiciliary Account",
      bank: "Zenith Bank Plc.",
      name: "Ecclesia Christian Embassy Domiciliary",
      number: "5366144582",
    },
    {
      label: "Kingdom Life Squads Mission Account",
      bank: "Zenith Bank Plc.",
      name: "Kingdom Model Life Squad Initiative",
      number: "1015080164",
    },
  ];

  const handleCopyAccountNumber = async (number: string, index: number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedIndex(index);
      success("Account number copied to clipboard");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      error("Failed to copy account number");
    }
  };

  const handleOnlinePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !amount) {
      error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const parsedAmount = parseFloat(amount);
      const isInternational = currency !== "NGN";

      if (isInternational) {
        const response = await giving.initializePaypal({
          amount: parsedAmount,
          currency,
          category,
          email,
          name,
        });
        success("Payment initiated via PayPal. Redirecting...");
        if (response.orderId) {
          window.location.href = `https://www.paypal.com/checkoutnow?token=${response.orderId}`;
        }
      } else {
        const response = await giving.initializePaystack({
          amount: parsedAmount,
          currency,
          category,
          email,
          name,
          isRecurring,
        });
        if (response.authorization_url) {
          window.location.href = response.authorization_url;
        } else {
          success("Payment initiated. Redirecting...");
        }
      }
    } catch (err) {
      error(
        err instanceof Error ? err.message : "Failed to initiate payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-bands">
      <PageHero
        eyebrow="Give / Sow"
        title="Your generosity fuels the Kingdom."
        subtitle="Give what the Lord has put in your heart."
        description="Every gift sown into this house is an act of worship and Kingdom partnership. Whether by card, transfer, or standing order — your giving matters."
        backgroundImage="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&q=80"
        compact
      />

      {/* Giving form */}
      <SectionWrapper variant="white">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-light">
                <Heart className="h-7 w-7 text-purple-vivid" fill="currentColor" />
              </div>
              <SectionHeading
                eyebrow="Cheerful Giving"
                title="Give what the Lord has put in your heart."
                description="The Lord bless you abundantly as you give with a cheerful heart."
                align="center"
              />
            </div>

            <form onSubmit={handleOnlinePaymentSubmit} className="space-y-6">
              {/* Gift category */}
              <div>
                <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Gift Category
                </label>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={[
                    { value: "TITHE", label: "Tithe" },
                    { value: "OFFERING", label: "Offering" },
                    { value: "SOW_A_SEED", label: "Sow a Seed" },
                    { value: "PROJECT_GIVING", label: "Project Giving" },
                    { value: "SPECIAL_OFFERING", label: "Special Offering" },
                  ]}
                  className="w-full"
                />
              </div>

              {/* Amount + Currency */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                    Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                    Currency
                  </label>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    options={[
                      { value: "NGN", label: "NGN" },
                      { value: "USD", label: "USD" },
                      { value: "GBP", label: "GBP" },
                      { value: "EUR", label: "EUR" },
                    ]}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Payment method tabs */}
              <div>
                <label className="mb-3 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Payment Method
                </label>
                <div className="flex gap-2 rounded-[18px] border border-[rgba(14,11,30,0.10)] bg-lavender p-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 font-heading text-xs font-bold uppercase tracking-[0.1em] transition-all duration-200",
                      paymentMethod === "online"
                        ? "bg-slate text-white shadow-sm"
                        : "text-gray-text hover:text-slate"
                    )}
                  >
                    <CreditCard size={14} />
                    Online Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 font-heading text-xs font-bold uppercase tracking-[0.1em] transition-all duration-200",
                      paymentMethod === "bank"
                        ? "bg-slate text-white shadow-sm"
                        : "text-gray-text hover:text-slate"
                    )}
                  >
                    <Building size={14} />
                    Bank Transfer
                  </button>
                </div>
              </div>

              {/* Online payment fields */}
              {paymentMethod === "online" && (
                <FadeIn>
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        id="recurring"
                      />
                      <label
                        htmlFor="recurring"
                        className="cursor-pointer font-body text-sm text-gray-text"
                      >
                        Make this a recurring monthly gift
                      </label>
                    </div>

                    <Button
                      type="submit"
                      variant="giving"
                      disabled={isLoading}
                      className="mt-4 w-full"
                    >
                      {isLoading ? "Processing..." : "Give Now"}
                    </Button>
                  </div>
                </FadeIn>
              )}

              {/* Bank transfer details */}
              {paymentMethod === "bank" && (
                <ScaleIn>
                  <div className="space-y-4 pt-1">
                    {bankAccounts.map((account, i) => (
                      <div
                        key={i}
                        className="soft-card rounded-[24px] p-5"
                      >
                        <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-purple-vivid">
                          {account.label}
                        </p>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-body text-xs text-gray-text">Bank</span>
                            <span className="font-body text-sm font-medium text-slate">{account.bank}</span>
                          </div>
                          <div className="flex flex-wrap items-start justify-between gap-1">
                            <span className="font-body text-xs text-gray-text shrink-0">Account Name</span>
                            <span className="font-body text-right text-sm font-medium text-slate max-w-[60%]">{account.name}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-body text-xs text-gray-text shrink-0">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold tracking-wider text-slate">
                                {account.number}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyAccountNumber(account.number, i)}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-light text-purple-vivid transition-colors hover:bg-lavender"
                                aria-label="Copy account number"
                              >
                                {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-[20px] border border-gold/25 bg-gold/8 p-4">
                      <p className="font-body text-sm leading-7 text-slate">
                        <span className="font-semibold">Instructions:</span>{" "}
                        Transfer the amount to the appropriate account above. Please include your name as the transfer reference so we can acknowledge your gift.
                      </p>
                    </div>
                  </div>
                </ScaleIn>
              )}
            </form>
          </FadeIn>
        </div>
      </SectionWrapper>

      {/* Scripture */}
      <SectionWrapper variant="dark-purple">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            2 Corinthians 9:7
          </p>
          <blockquote className="mt-6 font-serif text-xl italic leading-9 text-white md:text-2xl">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
          </blockquote>
        </div>
      </SectionWrapper>
    </main>
  );
}
