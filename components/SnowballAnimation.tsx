"use client";

import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

interface Debt {
  id: number;
  name: string;
  balance: number;
  color: string;
  minPayment: number;
}

export default function SnowballAnimation() {
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: 1,
      name: "Credit Card",
      balance: 2500,
      color: "#ef4444",
      minPayment: 75,
    },
    {
      id: 2,
      name: "Car Loan",
      balance: 8000,
      color: "#f59e0b",
      minPayment: 200,
    },
    {
      id: 3,
      name: "Student Loan",
      balance: 15000,
      color: "#10b981",
      minPayment: 150,
    },
    {
      id: 4,
      name: "Mortgage",
      balance: 120000,
      color: "#3b82f6",
      minPayment: 800,
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [extraPayment, setExtraPayment] = useState(500);
  const [displayBalances, setDisplayBalances] = useState<number[]>([
    2500, 8000, 15000, 120000,
  ]);
  const [freedSavings, setFreedSavings] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 15) {
          // Reset everything when animation completes
          setDisplayBalances([2500, 8000, 15000, 120000]);
          setFreedSavings(0);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animate balance counters
  useEffect(() => {
    const animatedDebts = getAnimatedDebts();
    const newBalances = animatedDebts.map((debt) => debt.balance);

    // Animate balance changes
    const animateBalances = () => {
      setDisplayBalances((prev) => {
        return prev.map((current, index) => {
          const target = newBalances[index];
          if (current === target) return current;

          const diff = target - current;
          const step = Math.ceil(Math.abs(diff) / 10);

          if (diff > 0) {
            return Math.min(current + step, target);
          } else {
            return Math.max(current - step, target);
          }
        });
      });
    };

    const balanceInterval = setInterval(animateBalances, 50);
    return () => clearInterval(balanceInterval);
  }, [currentStep]);

  // Calculate freed savings
  useEffect(() => {
    let savings = 0;
    if (currentStep >= 5) savings += debts[0].minPayment; // Credit Card paid off
    if (currentStep >= 8) savings += debts[1].minPayment; // Car Loan paid off
    if (currentStep >= 11) savings += debts[2].minPayment; // Student Loan paid off
    if (currentStep >= 14) savings += debts[3].minPayment; // Mortgage paid off

    setFreedSavings(savings);
  }, [currentStep, debts]);

  const getAnimatedDebts = () => {
    const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);

    if (currentStep < 2) {
      return sortedDebts;
    } else if (currentStep < 5) {
      // First debt being paid off
      const firstDebtPayment = sortedDebts[0].minPayment + extraPayment;
      return sortedDebts.map((debt, index) =>
        index === 0
          ? {
              ...debt,
              balance: Math.max(
                0,
                debt.balance - firstDebtPayment * (currentStep - 1)
              ),
            }
          : debt
      );
    } else if (currentStep < 8) {
      // Second debt being paid off (now includes first debt's minimum payment)
      const secondDebtPayment =
        sortedDebts[1].minPayment + extraPayment + sortedDebts[0].minPayment;
      return sortedDebts.map((debt, index) =>
        index === 0
          ? { ...debt, balance: 0 }
          : index === 1
          ? {
              ...debt,
              balance: Math.max(
                0,
                debt.balance - secondDebtPayment * (currentStep - 4)
              ),
            }
          : debt
      );
    } else if (currentStep < 11) {
      // Third debt being paid off (now includes first two debts' minimum payments)
      const thirdDebtPayment =
        sortedDebts[2].minPayment +
        extraPayment +
        sortedDebts[0].minPayment +
        sortedDebts[1].minPayment;
      return sortedDebts.map((debt, index) =>
        index === 0
          ? { ...debt, balance: 0 }
          : index === 1
          ? { ...debt, balance: 0 }
          : index === 2
          ? {
              ...debt,
              balance: Math.max(
                0,
                debt.balance - thirdDebtPayment * (currentStep - 7)
              ),
            }
          : debt
      );
    } else if (currentStep < 14) {
      // Fourth debt being paid off (now includes all previous minimum payments)
      const fourthDebtPayment =
        sortedDebts[3].minPayment +
        extraPayment +
        sortedDebts[0].minPayment +
        sortedDebts[1].minPayment +
        sortedDebts[2].minPayment;
      return sortedDebts.map((debt, index) =>
        index === 0
          ? { ...debt, balance: 0 }
          : index === 1
          ? { ...debt, balance: 0 }
          : index === 2
          ? { ...debt, balance: 0 }
          : {
              ...debt,
              balance: Math.max(
                0,
                debt.balance - fourthDebtPayment * (currentStep - 10)
              ),
            }
      );
    } else {
      // All debts paid off - show completion
      return sortedDebts.map((debt) => ({ ...debt, balance: 0 }));
    }
  };

  // Calculate current minimum payment for each debt based on snowball effect
  const getCurrentMinPayment = (debtIndex: number) => {
    const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);
    const debt = sortedDebts[debtIndex];

    if (currentStep < 2) {
      return debt.minPayment;
    } else if (currentStep < 5) {
      // Only first debt is being paid off
      return debt.minPayment;
    } else if (currentStep < 8) {
      // Second debt now includes first debt's minimum
      if (debtIndex === 1) {
        return debt.minPayment + sortedDebts[0].minPayment;
      }
      return debt.minPayment;
    } else if (currentStep < 11) {
      // Third debt now includes first two debts' minimums
      if (debtIndex === 2) {
        return (
          debt.minPayment +
          sortedDebts[0].minPayment +
          sortedDebts[1].minPayment
        );
      }
      return debt.minPayment;
    } else if (currentStep < 14) {
      // Fourth debt now includes all previous minimums
      if (debtIndex === 3) {
        return (
          debt.minPayment +
          sortedDebts[0].minPayment +
          sortedDebts[1].minPayment +
          sortedDebts[2].minPayment
        );
      }
      return debt.minPayment;
    }
    return debt.minPayment;
  };

  const animatedDebts = getAnimatedDebts();
  const totalDebt = animatedDebts.reduce((sum, debt) => sum + debt.balance, 0);
  const originalTotal = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const progress = ((originalTotal - totalDebt) / originalTotal) * 100;

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
      {/* Progress Bar */}
      <Box sx={{ width: "80%", mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Total Debt: ${totalDebt.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            {progress.toFixed(1)}% Paid Off
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
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #10b981, #34d399)",
              transition: "width 0.5s ease-in-out",
            }}
          />
        </Box>
      </Box>

      {/* Debt Cards */}
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "80%" }}
      >
        {animatedDebts.map((debt, index) => {
          const sortedIndex = [...debts]
            .sort((a, b) => a.balance - b.balance)
            .findIndex((d) => d.id === debt.id);
          const currentMinPayment = getCurrentMinPayment(sortedIndex);

          return (
            <Box
              key={debt.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.3s ease-in-out",
                opacity: debt.balance === 0 ? 0.6 : 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: debt.color,
                  }}
                />
                <Typography sx={{ color: "white", fontWeight: 500 }}>
                  {debt.name}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{ color: "white", fontWeight: 600, fontSize: "1.1rem" }}
                >
                  ${displayBalances[index].toLocaleString()}
                </Typography>
                {debt.balance > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Min: ${currentMinPayment.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Animation Status */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}
        >
          {currentStep < 2 && "Starting your debt-free journey..."}
          {currentStep >= 2 &&
            currentStep < 5 &&
            "Paying off smallest debt first..."}
          {currentStep >= 5 &&
            currentStep < 8 &&
            "Moving to next debt with increased payment..."}
          {currentStep >= 8 &&
            currentStep < 11 &&
            "Building momentum with snowball effect..."}
          {currentStep >= 11 &&
            currentStep < 14 &&
            "Final debt with maximum payment power..."}
          {currentStep >= 14 && "🎉 DEBT FREE! All debts paid off!"}
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
          {currentStep < 14
            ? `Freed up monthly payments: $${freedSavings.toLocaleString()}`
            : "Total monthly savings: $1,225 (DEBT FREE!)"}
        </Typography>
      </Box>
    </Box>
  );
}
