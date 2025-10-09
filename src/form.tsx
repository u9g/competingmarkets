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

export function BettingForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [betDescription, setBetDescription] = useState("");
  const [betterPays, setBetterPays] = useState("10");
  const [takerPays, setTakerPays] = useState("10");
  const [errors, setErrors] = useState<{
    betterPays?: string;
    takerPays?: string;
  }>({});

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
    });

    // You can add your bet submission logic here
    alert(
      `Bet created!\nBetter pays: $${betterAmount}\nTaker pays: $${takerAmount}`
    );
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

  return (
    <Card className="w-full max-w-2xl">
      {!isExpanded ? (
        <CardContent className="pt-6">
          <Button
            onClick={() => setIsExpanded(true)}
            size="lg"
            className="w-full text-lg font-semibold"
          >
            Make a bet
          </Button>
        </CardContent>
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
                        onChange={(e) => handleBetterPaysChange(e.target.value)}
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
                    <Label htmlFor="taker-pays" className="text-sm font-medium">
                      Taker pays
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
                        onChange={(e) => handleTakerPaysChange(e.target.value)}
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
                    <SlideToUnlockText className="text-white">
                      <ShimmeringText
                        text="Slide to submit"
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
  );
}
