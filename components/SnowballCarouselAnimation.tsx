"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

interface Debt {
  id: number;
  name: string;
  balance: number;
  color: string;
  minPayment: number;
}

export default function SnowballCarouselAnimation() {
  // Base debts (sorted by smallest monthly payment per user request)
  const baseDebts: Debt[] = useMemo(
    () =>
      [
        {
          id: 1,
          name: "Gym Arrears",
          balance: 300,
          color: "#a855f7",
          minPayment: 25,
        },
        {
          id: 2,
          name: "Store Card",
          balance: 600,
          color: "#ef4444",
          minPayment: 35,
        },
        {
          id: 3,
          name: "Phone Financing",
          balance: 900,
          color: "#f97316",
          minPayment: 40,
        },
        {
          id: 4,
          name: "Medical Bill",
          balance: 1200,
          color: "#22c55e",
          minPayment: 50,
        },
        {
          id: 5,
          name: "Credit Card",
          balance: 2500,
          color: "#ef4444",
          minPayment: 75,
        },
        {
          id: 6,
          name: "Personal Loan",
          balance: 3500,
          color: "#14b8a6",
          minPayment: 95,
        },
        {
          id: 7,
          name: "Student Loan",
          balance: 15000,
          color: "#10b981",
          minPayment: 150,
        },
        {
          id: 8,
          name: "Car Loan",
          balance: 8000,
          color: "#f59e0b",
          minPayment: 200,
        },
      ].sort((a, b) => a.minPayment - b.minPayment),
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [balances, setBalances] = useState<number[]>(
    baseDebts.map((d) => d.balance)
  );
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const [displayTotal, setDisplayTotal] = useState<number>(
    baseDebts.reduce((sum, d) => sum + d.balance, 0)
  );
  const [monthlySaved, setMonthlySaved] = useState<number>(0);

  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const overlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalTarget = useMemo(
    () => balances.reduce((sum, v) => sum + v, 0),
    [balances]
  );

  // Smoothly animate displayed total toward actual total (paused during overlay)
  useEffect(() => {
    if (overlayText) return;
    const anim = setInterval(() => {
      setDisplayTotal((current) => {
        if (current === totalTarget) return current;
        const diff = totalTarget - current;
        const step = Math.ceil(Math.abs(diff) / 10);
        return diff > 0
          ? Math.min(current + step, totalTarget)
          : Math.max(current - step, totalTarget);
      });
    }, 50);
    return () => clearInterval(anim);
  }, [totalTarget, overlayText]);

  // Compute snowball payment applied to the currently focused debt
  const currentPaymentPerTick = useMemo(() => {
    const completedMinSum = baseDebts
      .slice(0, activeIndex)
      .reduce((sum, d) => sum + d.minPayment, 0);
    const currentDebtMin = baseDebts[activeIndex]?.minPayment ?? 0;
    // Per "tick" amount. Keep moderately sized for visual pacing.
    return completedMinSum + currentDebtMin;
  }, [activeIndex, baseDebts]);

  // Drive the countdown for the active card
  useEffect(() => {
    // Clear any existing interval when inputs change
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
    }

    // If overlay is visible, pause everything until it disappears
    if (overlayText) {
      return () => {};
    }

    // If all debts are complete, restart after a short delay
    const allDone = balances.every((b) => b <= 0);
    if (allDone) {
      overlayTimeoutRef.current = setTimeout(() => {
        const initialTotal = baseDebts.reduce((sum, d) => sum + d.balance, 0);
        setBalances(baseDebts.map((d) => d.balance));
        setActiveIndex(0);
        setOverlayText(null);
        setMonthlySaved(0);
        setDisplayTotal(initialTotal);
      }, 1200);
      return () => {};
    }

    // Skip already-completed entries
    if (balances[activeIndex] <= 0) {
      // Advance to first non-zero debt
      const next = balances.findIndex((b) => b > 0);
      if (next !== -1) setActiveIndex(next);
      return () => {};
    }

    tickIntervalRef.current = setInterval(() => {
      setBalances((prev) => {
        const nextBalances = [...prev];
        const remaining = nextBalances[activeIndex];
        if (remaining <= 0) return prev;

        const decrement = Math.min(
          remaining,
          Math.max(25, Math.floor(currentPaymentPerTick / 6))
        );
        nextBalances[activeIndex] = remaining - decrement;

        // If just finished this debt, show overlay and queue advance
        if (nextBalances[activeIndex] <= 0) {
          // Show the monthly min payment snowballed forward
          setOverlayText(
            `$${baseDebts[
              activeIndex
            ].minPayment.toLocaleString()} / Month Snowballed!`
          );
          setMonthlySaved(
            () => monthlySaved + baseDebts[activeIndex].minPayment
          );
          if (tickIntervalRef.current) {
            clearInterval(tickIntervalRef.current);
          }
          overlayTimeoutRef.current = setTimeout(() => {
            setOverlayText(null);
            // Advance to the next unpaid debt
            const nextIdx = nextBalances.findIndex((b) => b > 0);
            if (nextIdx !== -1) {
              setActiveIndex(nextIdx);
            } else {
              // All done; handled by outer effect next cycle
            }
          }, 2000);
        }

        return nextBalances;
      });
    }, 80);

    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, [activeIndex, currentPaymentPerTick, baseDebts, balances, overlayText]);

  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
    };
  }, []);

  const currentDebt = baseDebts[activeIndex] ?? baseDebts[baseDebts.length - 1];
  const currentBalance = balances[activeIndex] ?? 0;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Header: Total Debt */}
      <Box sx={{ width: "80%", mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Total Debt: ${displayTotal.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Monthly Payments Saved: ${monthlySaved.toLocaleString()}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: 8,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${
                ((baseDebts.reduce((s, d) => s + d.balance, 0) - displayTotal) /
                  baseDebts.reduce((s, d) => s + d.balance, 0)) *
                100
              }%`,
              height: "100%",
              background: "linear-gradient(90deg, #10b981, #34d399)",
              transition: "width 0.2s linear",
            }}
          />
        </Box>
      </Box>

      {/* Carousel viewport */}
      <Box
        sx={{
          position: "relative",
          width: "80%",
          height: 160,
          overflow: "hidden",
        }}
      >
        {/* Card */}
        <Box
          key={currentDebt.id}
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.2)",
            animation: "slideUpIn 400ms ease",
            "@keyframes slideUpIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: currentDebt.color,
              }}
            />
            <Typography sx={{ color: "white", fontWeight: 500 }}>
              {currentDebt.name}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{ color: "white", fontWeight: 600, fontSize: "1.1rem" }}
            >
              ${Math.max(0, Math.round(currentBalance)).toLocaleString()}
            </Typography>
            {currentBalance > 0 && (
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.6)" }}
              >
                Min: ${currentDebt.minPayment.toLocaleString()}
              </Typography>
            )}
          </Box>

          {/* Overlay when a debt is completed */}
          {overlayText && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.35)",
                borderRadius: 2,
                backdropFilter: "blur(5px)",
              }}
            >
              <Typography
                sx={{
                  color: "#10b981",
                  fontWeight: 800,
                  fontSize: "1.75rem",
                  textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {overlayText}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Small status text */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem" }}
        >
          Paying off debts smallest to largest balance...
        </Typography>
      </Box>
    </Box>
  );
}
