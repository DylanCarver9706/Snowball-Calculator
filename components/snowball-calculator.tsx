"use client";

import { useState } from "react";
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
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [bills, setBills] = useState<Bill[]>([
    {
      name: "Ascent Funding School Loan",
      interestRate: 13.25,
      monthlyPayment: 755,
      currentBalance: 7140.74,
    },
    {
      name: "Capital One Quicksilver Credit Card",
      interestRate: 29.24,
      monthlyPayment: 50,
      currentBalance: 444.7,
    },
    {
      name: "Dylan Mercy Debt",
      interestRate: 0,
      monthlyPayment: 35,
      currentBalance: 232.5,
    },
    {
      name: "Kristen Mercy Urgent Care Debt",
      interestRate: 0,
      monthlyPayment: 35,
      currentBalance: 15,
    },
    {
      name: "Kristen Mercy Debt",
      interestRate: 0,
      monthlyPayment: 35,
      currentBalance: 730,
    },
    {
      name: "Commerce Credit Card",
      interestRate: 27.49,
      monthlyPayment: 50,
      currentBalance: 414.16,
    },
    {
      name: "Capital One Secured Credit Card",
      interestRate: 29.49,
      monthlyPayment: 50,
      currentBalance: 470.77,
    },
    {
      name: "Sheffield Financial Trailer Loan",
      interestRate: 12.24,
      monthlyPayment: 197.39,
      currentBalance: 2594.08,
    },
    {
      name: "Kristen Student Loan",
      interestRate: 4.99,
      monthlyPayment: 50.38,
      currentBalance: 3635.04,
    },
    {
      name: "Red Rocker Car Loan",
      interestRate: 18.14,
      monthlyPayment: 317.48,
      currentBalance: 11900.49,
    },
    {
      name: "Credit One Credit Card",
      interestRate: 28.24,
      monthlyPayment: 65,
      currentBalance: 1036.33,
    },
    {
      name: "Dylan MoBap Student Loan",
      interestRate: 0,
      monthlyPayment: 125.71,
      currentBalance: 1131.37,
    },
    {
      name: "Wedding Credit Card",
      interestRate: 0,
      monthlyPayment: 150,
      currentBalance: 14682.97,
    },
    {
      name: "Dylan Federal Student Loan",
      interestRate: 3.73,
      monthlyPayment: 52.75,
      currentBalance: 1655.01,
    },
    {
      name: "Shane Co. Credit Card",
      interestRate: 9.99,
      monthlyPayment: 127,
      currentBalance: 2194.98,
    },
    {
      name: "Subaru Car Loan",
      interestRate: 4.84,
      monthlyPayment: 500,
      currentBalance: 14606.05,
    },
  ]);
  const [editing, setEditing] = useState(false);
  const [editBills, setEditBills] = useState<Bill[] | null>(null);
  const [editMonthlyContribution, setEditMonthlyContribution] = useState<
    number | null
  >(null);

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
  const saveEdit = () => {
    if (editBills && editMonthlyContribution !== null) {
      const sortedEditBills = [...editBills].sort(
        (a, b) => a.currentBalance - b.currentBalance
      );
      setBills(sortedEditBills);
      setMonthlyContribution(editMonthlyContribution);
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
    setEditBills((prev) =>
      prev ? [...prev, getDefaultBill()] : prev
    );
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
