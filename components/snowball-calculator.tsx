"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Bill } from "@/lib/types";
import { calculateSnowball } from "@/lib/snowball-calculator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getDefaultBill(): Bill {
  return {
    name: "New Debt",
    interestRate: 10,
    monthlyPayment: 500,
    currentBalance: 10000,
  };
}

export function SnowballCalculator() {
  const { user, isLoaded } = useUser();
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [bills, setBills] = useState<Bill[]>([]);
  const [editing, setEditing] = useState(false);
  const [editBills, setEditBills] = useState<Bill[] | null>(null);
  const [editMonthlyContribution, setEditMonthlyContribution] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  // Load data from Clerk metadata on component mount
  useEffect(() => {
    if (isLoaded && user) {
      const metadata = user.publicMetadata as any;

      if (metadata.monthlyContribution && metadata.bills) {
        setMonthlyContribution(metadata.monthlyContribution);
        setBills(metadata.bills);
      }
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  // Function to save data to Clerk metadata
  const saveToMetadata = async (
    newBills: Bill[],
    newMonthlyContribution: number
  ) => {
    if (!user) return;

    try {
      const response = await fetch("/api/update-user-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            monthlyContribution: newMonthlyContribution,
            bills: newBills,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving to metadata:", error);
    }
  };

  const handleBillChange = (
    index: number,
    field: keyof Bill,
    value: string | number
  ) => {
    setBills((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]:
          typeof value === "string" &&
          (field === "interestRate" ||
            field === "monthlyPayment" ||
            field === "currentBalance")
            ? Number(value)
            : value,
      };
      return updated;
    });
  };

  const handleAddBill = () => {
    setBills((prev) => [...prev, getDefaultBill()]);
  };

  // For editing mode
  const startEdit = () => {
    setEditBills(JSON.parse(JSON.stringify(bills)));
    setEditMonthlyContribution(monthlyContribution);
    setEditing(true);
  };
  const cancelEdit = () => {
    setEditBills(null);
    setEditMonthlyContribution(null);
    setEditing(false);
  };
  const saveEdit = async () => {
    if (editBills && editMonthlyContribution !== null) {
      const sortedEditBills = [...editBills].sort(
        (a, b) => a.currentBalance - b.currentBalance
      );
      setBills(sortedEditBills);
      setMonthlyContribution(editMonthlyContribution);

      // Save to metadata
      await saveToMetadata(sortedEditBills, editMonthlyContribution);

      const newCalc = calculateSnowball(
        sortedEditBills,
        editMonthlyContribution
      );
      setCalculation(newCalc);
      setMaxMonths(Math.max(...newCalc.map((debt) => debt.months.length)));
    }
    setEditBills(null);
    setEditMonthlyContribution(null);
    setEditing(false);
  };
  const handleEditBillChange = (
    index: number,
    field: keyof Bill,
    value: string | number
  ) => {
    setEditBills((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]:
          typeof value === "string" &&
          (field === "interestRate" ||
            field === "monthlyPayment" ||
            field === "currentBalance")
            ? Number(value)
            : value,
      };
      return updated;
    });
  };
  const handleEditAddBill = () => {
    setEditBills((prev) => (prev ? [...prev, getDefaultBill()] : prev));
  };

  // Sort by balance (ascending) before calculation
  const sortedBills = [...bills].sort(
    (a, b) => a.currentBalance - b.currentBalance
  );
  const [calculation, setCalculation] = useState(() =>
    calculateSnowball(sortedBills, monthlyContribution)
  );
  const [maxMonths, setMaxMonths] = useState(() =>
    Math.max(...calculation.map((debt) => debt.months.length))
  );

  // Update calculation when bills or monthlyContribution changes
  useEffect(() => {
    if (bills.length > 0) {
      const sortedBills = [...bills].sort(
        (a, b) => a.currentBalance - b.currentBalance
      );
      const newCalc = calculateSnowball(sortedBills, monthlyContribution);
      setCalculation(newCalc);
      setMaxMonths(Math.max(...newCalc.map((debt) => debt.months.length)));
    }
  }, [bills, monthlyContribution]);

  if (isLoading) {
    return <div className="w-full text-center py-8">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-8 bg-white/30 p-6 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Monthly Extra Payment
            </label>
            {editing ? (
              <Input
                type="number"
                value={editMonthlyContribution ?? monthlyContribution}
                onChange={(e) =>
                  setEditMonthlyContribution(Number(e.target.value))
                }
                className="w-48"
              />
            ) : (
              <span className="text-lg">${monthlyContribution}</span>
            )}
          </div>
          {editing ? (
            <>
              <Button onClick={saveEdit} className="ml-4">
                Save
              </Button>
              <Button onClick={cancelEdit} className="ml-2" variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleEditAddBill} className="ml-2">
                + Add Debt
              </Button>
            </>
          ) : (
            <Button onClick={startEdit} className="ml-4">
              Edit
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        <div className="overflow-x-auto bg-white/30 p-6 rounded-lg backdrop-blur-sm">
          <Table className="table-auto w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Debt Name</TableHead>
                <TableHead className="w-24">Rate (%)</TableHead>
                <TableHead className="w-20">Payment</TableHead>
                <TableHead className="w-24">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editBills &&
                editBills.map((bill, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Input
                        className="w-full max-w-xs font-bold text-center"
                        value={bill.name}
                        onChange={(e) =>
                          handleEditBillChange(idx, "name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-full max-w-[5rem] text-center"
                        value={bill.interestRate}
                        min={0}
                        step={0.01}
                        onChange={(e) =>
                          handleEditBillChange(
                            idx,
                            "interestRate",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-full max-w-[5rem] text-center"
                        value={bill.monthlyPayment}
                        min={0}
                        step={1}
                        onChange={(e) =>
                          handleEditBillChange(
                            idx,
                            "monthlyPayment",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-full max-w-[7rem] text-center"
                        value={bill.currentBalance}
                        min={0}
                        step={1}
                        onChange={(e) =>
                          handleEditBillChange(
                            idx,
                            "currentBalance",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white/30 p-6 rounded-lg backdrop-blur-sm">
          <TooltipProvider>
            <Table className="table-fixed w-full border border-slate-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 border-r border-slate-200">
                    Month
                  </TableHead>
                  {sortedBills.map((bill, idx) => (
                    <TableHead
                      key={idx}
                      className={`w-56 text-center${
                        idx !== sortedBills.length - 1
                          ? " border-r border-slate-200"
                          : ""
                      }`}
                    >
                      <span className="font-bold">{bill.name}</span>
                      <div className="flex flex-col gap-1 items-center">
                        <div className="flex gap-1 items-center">
                          <span className="text-xs">Rate:</span>
                          <span className="text-xs">{bill.interestRate}%</span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <span className="text-xs">Payment:</span>
                          <span className="text-xs">
                            ${bill.monthlyPayment}/mo
                          </span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <span className="text-xs">Balance:</span>
                          <span className="text-xs">
                            ${bill.currentBalance}
                          </span>
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: maxMonths }, (_, monthIndex) => (
                  <TableRow key={monthIndex}>
                    <TableCell className="w-40 font-medium border-r border-slate-200">
                      Month {monthIndex + 1}
                    </TableCell>
                    {calculation.map((debt, idx) => {
                      const monthData = debt.months[monthIndex];
                      const payoffIdx = debt.months.findIndex(
                        (m, idx) =>
                          m.remainingBalance === 0 &&
                          (idx === 0 ||
                            debt.months[idx - 1].remainingBalance > 0)
                      );
                      const isSnowballed =
                        payoffIdx !== -1 && monthIndex > payoffIdx;
                      return (
                        <TableCell
                          key={idx}
                          className={`w-72 text-center${
                            idx !== calculation.length - 1
                              ? " border-r border-slate-200"
                              : ""
                          } ${
                            isSnowballed
                              ? "bg-green-50 dark:bg-green-900/20"
                              : ""
                          }`}
                        >
                          {isSnowballed ? (
                            <div className="text-green-600 dark:text-green-400 font-medium text-center">
                              Snowballed
                            </div>
                          ) : monthData ? (
                            <>
                              <div className="font-medium flex items-center justify-center gap-1">
                                Pay: ${monthData.payment.toFixed(2)}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-pointer text-gray-400 align-middle">
                                      ℹ️
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs text-xs text-left">
                                    {monthData.info}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="text-sm text-gray-500">
                                Balance Remaining: $
                                {monthData.remainingBalance.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-400">
                                Principal: ${monthData.principalPaid.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-400">
                                Interest: ${monthData.interestPaid.toFixed(2)}
                              </div>
                              {monthData.rollover > 0 && (
                                <div className="text-xs text-orange-500 font-semibold">
                                  Rollover: ${monthData.rollover.toFixed(2)}
                                </div>
                              )}
                            </>
                          ) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}
