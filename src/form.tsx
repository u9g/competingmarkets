"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  SlideToUnlock,
  SlideToUnlockHandle,
  SlideToUnlockText,
  SlideToUnlockTrack,
} from "@/components/slide-to-unlock";
import { ShimmeringText } from "@/components/shimmering-text";

interface BettingFormProps {
  isHovering: boolean;
  onExpandRef?: (
    expandFn: () => void,
    collapseFn: () => void,
    isExpanded: boolean
  ) => void;
}

export function BettingForm({ isHovering, onExpandRef }: BettingFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBetScreenHovered, setIsBetScreenHovered] = useState(false);
  const [betDescription, setBetDescription] = useState("");
  const [betterPays, setBetterPays] = useState("10");
  const [takerPays, setTakerPays] = useState("10");
  const [prediction, setPrediction] = useState<"yes" | "no">("yes");
  const [errors, setErrors] = useState<{
    betterPays?: string;
    takerPays?: string;
  }>({});

  // Expose expand/collapse functions to parent
  if (onExpandRef) {
    onExpandRef(
      () => setIsExpanded(true),
      () => setIsExpanded(false),
      isExpanded
    );
  }

  // Combine tweet hover and bet screen hover
  const shouldShowButton = isHovering || isBetScreenHovered;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { betterPays?: string; takerPays?: string } = {};

    const betterAmount = Number.parseFloat(betterPays);
    const takerAmount = Number.parseFloat(takerPays);

    if (isNaN(betterAmount) || betterAmount < 10) {
      newErrors.betterPays = "Minimum bet is $10";
    }

    if (isNaN(takerAmount) || takerAmount < 10) {
      newErrors.takerPays = "Minimum bet is $10";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Handle bet submission
    console.log("[v0] Bet submitted:", {
      description: betDescription,
      betterPays: betterAmount,
      takerPays: takerAmount,
      prediction,
    });

    // Show confirmation screen
    setShowConfirmation(true);
  };

  const handleBetterPaysChange = (value: string) => {
    setBetterPays(value);
    if (errors.betterPays) {
      setErrors({ ...errors, betterPays: undefined });
    }
  };

  const handleTakerPaysChange = (value: string) => {
    setTakerPays(value);
    if (errors.takerPays) {
      setErrors({ ...errors, takerPays: undefined });
    }
  };

  const handleCreateAnother = () => {
    setShowConfirmation(false);
    setBetDescription("");
    setBetterPays("10");
    setTakerPays("10");
    setPrediction("yes");
    setErrors({});
  };

  return (
    <div
      onMouseEnter={() => setIsBetScreenHovered(true)}
      onMouseLeave={() => setIsBetScreenHovered(false)}
    >
      <Card className="w-full max-w-2xl">
        {showConfirmation ? (
          <CardContent className="py-12 px-8">
            <div className="flex flex-col items-center space-y-8">
              {/* Success Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg animate-in zoom-in duration-500">
                  <svg
                    className="w-14 h-14 text-white animate-in zoom-in duration-700 delay-150"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  Bet Offered!
                </h2>
                <p className="text-muted-foreground">
                  Your bet is now live and ready for takers
                </p>
              </div>

              {/* Bet Details Card */}
              <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border border-border/50 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      BET DESCRIPTION
                    </p>
                    <p className="text-lg font-semibold leading-relaxed">
                      {betDescription}
                    </p>
                  </div>

                  <div className="h-px bg-border/50" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        YOU PAY
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        ${Number.parseFloat(betterPays).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        THEY PAY
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${Number.parseFloat(takerPays).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-border/50" />

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      YOUR PREDICTION
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1.5 rounded-full font-semibold ${
                          prediction === "yes"
                            ? "bg-green-500/20 text-green-700 dark:text-green-400"
                            : "bg-red-500/20 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {prediction === "yes" ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                <Button
                  onClick={handleCreateAnother}
                  size="lg"
                  className="flex-1 text-base font-semibold"
                >
                  Create Another Bet
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirmation(false);
                    setIsExpanded(false);
                  }}
                  size="lg"
                  variant="outline"
                  className="flex-1 text-base font-semibold"
                >
                  Done
                </Button>
              </div>
            </div>
          </CardContent>
        ) : !isExpanded &&
          shouldShowButton ? null : //   // <CardContent className="pt-6">
        // <CardContent
        //   {/* intentionally empty */}
        //   {/* <Button
        //     onClick={() => setIsExpanded(true)}
        //     size="lg"
        //     className="w-full text-lg font-semibold"
        //   >
        //     Offer a bet
        //   </Button> */}
        // </CardContent>
        !isExpanded ? (
          <div className="h-0" />
        ) : (
          <>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-3xl font-bold text-balance">
                  Make a Bet
                </CardTitle>
                <Button
                  onClick={() => setIsExpanded(false)}
                  size="lg"
                  variant="outline"
                  className="text-lg font-semibold"
                >
                  Nevermind
                </Button>
              </div>
              <CardDescription className="text-muted-foreground">
                Set up your bet and define the stakes for both parties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Bet Description */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-sm font-semibold">
                      1
                    </div>
                    <Label
                      htmlFor="bet-description"
                      className="text-lg font-semibold"
                    >
                      What's the bet?
                    </Label>
                  </div>
                  <Textarea
                    id="bet-description"
                    placeholder="Describe the bet (e.g., Lakers will win the championship)"
                    value={betDescription}
                    onChange={(e) => setBetDescription(e.target.value)}
                    className="min-h-[100px] resize-none"
                    required
                  />
                </div>

                {/* Step 2: Payment Amounts */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-sm font-semibold">
                      2
                    </div>
                    <Label className="text-lg font-semibold">
                      Set the stakes
                    </Label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Better Pays */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="better-pays"
                        className="text-sm font-medium"
                      >
                        Better pays
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="better-pays"
                          type="number"
                          min="10"
                          step="0.01"
                          value={betterPays}
                          onChange={(e) =>
                            handleBetterPaysChange(e.target.value)
                          }
                          className="pl-7"
                          required
                        />
                      </div>
                      {errors.betterPays && (
                        <p className="text-sm text-destructive">
                          {errors.betterPays}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Minimum: $10.00
                      </p>
                    </div>

                    {/* Taker Pays */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="taker-pays"
                        className="text-sm font-medium"
                      >
                        Other side
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="taker-pays"
                          type="number"
                          min="10"
                          step="0.01"
                          value={takerPays}
                          onChange={(e) =>
                            handleTakerPaysChange(e.target.value)
                          }
                          className="pl-7"
                          required
                        />
                      </div>
                      {errors.takerPays && (
                        <p className="text-sm text-destructive">
                          {errors.takerPays}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Minimum: $10.00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3: Prediction */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-sm font-semibold">
                      3
                    </div>
                    <Label className="text-lg font-semibold">
                      Do you think it will happen?
                    </Label>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <span
                        className={`text-sm font-medium transition-colors ${
                          prediction === "no"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        No
                      </span>
                      <span
                        className={`text-sm font-medium transition-colors ${
                          prediction === "yes"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        Yes
                      </span>
                    </div>
                    <div className="relative h-12 rounded-lg bg-muted p-1">
                      <div
                        className="absolute top-1 h-10 w-[calc(50%-4px)] rounded-md bg-primary transition-all duration-300 ease-out"
                        style={{
                          left:
                            prediction === "yes" ? "calc(50% + 4px)" : "4px",
                        }}
                      />
                      <div className="relative z-10 flex h-full">
                        <button
                          type="button"
                          onClick={() => setPrediction("no")}
                          className={`flex-1 rounded-md px-4 text-sm font-semibold transition-colors ${
                            prediction === "no"
                              ? "text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrediction("yes")}
                          className={`flex-1 rounded-md px-4 text-sm font-semibold transition-colors ${
                            prediction === "yes"
                              ? "text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Slider */}
                <div className="flex justify-center">
                  <SlideToUnlock
                    onUnlock={() => {
                      handleSubmit({
                        preventDefault: () => {},
                      } as React.FormEvent);
                    }}
                    className="w-full max-w-md bg-zinc-900 ring-white/10"
                  >
                    <SlideToUnlockTrack>
                      <SlideToUnlockText className="text-white !ml-0 absolute inset-0 flex items-center justify-center">
                        <ShimmeringText
                          text="Slide to offer"
                          duration={0.3}
                          className="[--color:var(--color-zinc-400)] [--shimmering-color:var(--color-zinc-50)]"
                        />
                      </SlideToUnlockText>
                      <SlideToUnlockHandle className="bg-green-600 hover:bg-green-700 text-white" />
                    </SlideToUnlockTrack>
                  </SlideToUnlock>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
