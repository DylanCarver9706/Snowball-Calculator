"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import type { Bill } from "@/lib/types";
import {
  calculateSnowball,
  type DebtWithSchedule,
} from "@/lib/snowball-calculator";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function getDefaultBill(): Bill {
  return {
    name: "New Debt",
    interestRate: 10,
    monthlyPayment: 50,
    currentBalance: 500,
  };
}

export function SnowballCalculator() {
  const { user, isLoaded } = useUser();
  const [monthlyContribution, setMonthlyContribution] = useState<number>(100);
  const [bills, setBills] = useState<Bill[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [editBills, setEditBills] = useState<Bill[] | null>(null);
  const [editMonthlyContribution, setEditMonthlyContribution] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { openSignIn } = useClerk();

  // Load data from Clerk metadata on component mount
  useEffect(() => {
    if (isLoaded && user) {
      const metadata = user.publicMetadata as any;
      if (metadata?.monthlyContribution && metadata?.bills) {
        setMonthlyContribution(metadata.monthlyContribution);
        setBills(metadata.bills);
      } else {
        // Seed with sample debts
        setBills([
          {
            name: "Store Card",
            interestRate: 15,
            monthlyPayment: 45,
            currentBalance: 1200,
          },
          {
            name: "Medical Bill",
            interestRate: 0,
            monthlyPayment: 150,
            currentBalance: 3500,
          },
          {
            name: "Credit Card",
            interestRate: 26,
            monthlyPayment: 250,
            currentBalance: 20000,
          },
          {
            name: "Personal Loan",
            interestRate: 8,
            monthlyPayment: 500,
            currentBalance: 10000,
          },
          {
            name: "Car Loan",
            interestRate: 6,
            monthlyPayment: 650,
            currentBalance: 30000,
          },
        ]);
      }
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  // If not signed in, open Clerk sign-in modal on load (browser only)
  useEffect(() => {
    if (isLoaded && !user) {
      openSignIn();
    }
  }, [isLoaded, user, openSignIn]);

  // Save data to Clerk metadata
  const saveToMetadata = async (
    newBills: Bill[],
    newMonthlyContribution: number
  ) => {
    if (!user) return;
    try {
      const res = await fetch("/api/update-user-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: {
            monthlyContribution: newMonthlyContribution,
            bills: newBills,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to save data");
    } catch (err) {
      console.error("Error saving to metadata:", err);
    }
  };

  // Derived and calculated data
  const sortedBills = useMemo(() => {
    return [...bills].sort((a, b) => a.currentBalance - b.currentBalance);
  }, [bills]);

  const calculation: DebtWithSchedule[] = useMemo(() => {
    if (sortedBills.length === 0) return [] as DebtWithSchedule[];
    return calculateSnowball(sortedBills, monthlyContribution);
  }, [sortedBills, monthlyContribution]);

  const maxMonths = useMemo(() => {
    if (calculation.length === 0) return 0;
    return Math.max(...calculation.map((d) => d.months.length));
  }, [calculation]);

  // Editing handlers
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
      const sorted = [...editBills].sort(
        (a, b) => a.currentBalance - b.currentBalance
      );
      setBills(sorted);
      setMonthlyContribution(editMonthlyContribution);
      await saveToMetadata(sorted, editMonthlyContribution);
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
      const parsed =
        typeof value === "string" &&
        (field === "interestRate" ||
          field === "monthlyPayment" ||
          field === "currentBalance")
          ? Number(value)
          : value;
      updated[index] = { ...updated[index], [field]: parsed } as Bill;
      return updated;
    });
  };

  const handleEditAddBill = () =>
    setEditBills((prev) => (prev ? [getDefaultBill(), ...prev] : prev));

  const handleEditDeleteBill = (index: number) => {
    setEditBills((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  if (user && isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Card
        sx={{
          p: { xs: 2, sm: 3 },
          background:
            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          color: "white",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems={{ xs: "center", sm: "center" }}
              justifyContent={{ xs: "center", sm: "flex-start" }}
              flexWrap="nowrap"
              sx={{ width: "100%", overflow: "hidden" }}
            >
              <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                Monthly Extra Payment:
              </Typography>
              {editing ? (
                <TextField
                  type="number"
                  size="medium"
                  value={editMonthlyContribution ?? monthlyContribution}
                  onChange={(e) =>
                    setEditMonthlyContribution(
                      Math.max(0, Math.floor(Number(e.target.value)))
                    )
                  }
                  inputProps={{ min: 0 }}
                  sx={{
                    minWidth: { xs: 70, sm: 140 },
                    maxWidth: { xs: 70, sm: 200 },
                    "& .MuiInputBase-input": { color: "white", fontSize: 18 },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.6)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  ${monthlyContribution}
                </Typography>
              )}
            </Stack>
          </Box>
          <Box sx={{ flexGrow: { xs: 0, sm: 1 } }} />
          {editing ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              flexWrap="wrap"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="contained"
                onClick={saveEdit}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                onClick={cancelEdit}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleEditAddBill}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Add Debt
              </Button>
            </Stack>
          ) : (
            <Button
              variant="contained"
              onClick={startEdit}
              sx={{
                backgroundColor: "white",
                color: "black",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                whiteSpace: "nowrap",
                height: 40,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Edit Table
            </Button>
          )}
        </Stack>
      </Card>

      {editing ? (
        <Card
          sx={{
            mt: 3,
            p: { xs: 2, sm: 3 },
            border: "1px solid rgba(37,99,235,0.15)",
          }}
        >
          {/* Mobile-friendly editor */}
          <Stack spacing={2} sx={{ display: { xs: "block", sm: "none" } }}>
            {editBills?.map((bill, idx) => (
              <Box
                key={idx}
                sx={{
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  gap: 2,
                  background:
                    "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
                  color: "white",
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Debt Name"
                      value={bill.name}
                      onChange={(e) =>
                        handleEditBillChange(idx, "name", e.target.value)
                      }
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                          fontSize: 18,
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                        maxWidth: "90%",
                      }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleEditDeleteBill(idx)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField
                      type="number"
                      size="small"
                      label="Rate (%)"
                      value={bill.interestRate}
                      onChange={(e) =>
                        handleEditBillChange(
                          idx,
                          "interestRate",
                          e.target.value
                        )
                      }
                      inputProps={{ min: 0, step: 0.01 }}
                      sx={{
                        minWidth: 100,
                        flex: 1,
                        "& .MuiInputBase-input": {
                          color: "white",
                          fontSize: 18,
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />
                    <TextField
                      type="number"
                      size="small"
                      label="Payment"
                      value={bill.monthlyPayment}
                      onChange={(e) =>
                        handleEditBillChange(
                          idx,
                          "monthlyPayment",
                          e.target.value
                        )
                      }
                      inputProps={{ min: 0, step: 1 }}
                      sx={{
                        minWidth: 100,
                        flex: 1,
                        "& .MuiInputBase-input": {
                          color: "white",
                          fontSize: 18,
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />
                    <TextField
                      type="number"
                      size="small"
                      label="Balance"
                      value={bill.currentBalance}
                      onChange={(e) =>
                        handleEditBillChange(
                          idx,
                          "currentBalance",
                          e.target.value
                        )
                      }
                      inputProps={{ min: 0, step: 1 }}
                      sx={{
                        minWidth: 120,
                        flex: 1,
                        "& .MuiInputBase-input": {
                          color: "white",
                          fontSize: 18,
                        },
                        "& .MuiInputLabel-root": { color: "white" },
                      }}
                    />
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Desktop/tablet editor */}
          <TableContainer sx={{ display: { xs: "none", sm: "block" } }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: { sm: 360, md: 420 } }}>
                    Debt Name
                  </TableCell>
                  <TableCell sx={{ width: { sm: 120, md: 200 } }}>
                    Interest Rate (%)
                  </TableCell>
                  <TableCell sx={{ width: { sm: 120, md: 200 } }}>
                    Min. Monthly Payment
                  </TableCell>
                  <TableCell sx={{ width: { sm: 140, md: 200 } }}>
                    Current Balance
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editBills?.map((bill, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ width: { sm: 360, md: 420 } }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={bill.name}
                        onChange={(e) =>
                          handleEditBillChange(idx, "name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ width: { sm: 120, md: 140 } }}>
                      <TextField
                        type="number"
                        size="small"
                        value={bill.interestRate}
                        onChange={(e) =>
                          handleEditBillChange(
                            idx,
                            "interestRate",
                            e.target.value
                          )
                        }
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{
                          maxWidth: { sm: 120, md: 140 },
                          "& .MuiInputBase-input": { fontSize: 13 },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: { sm: 120, md: 140 } }}>
                      <TextField
                        type="number"
                        size="small"
                        value={bill.monthlyPayment}
                        onChange={(e) =>
                          handleEditBillChange(
                            idx,
                            "monthlyPayment",
                            e.target.value
                          )
                        }
                        inputProps={{ min: 0, step: 1 }}
                        sx={{
                          maxWidth: { sm: 120, md: 140 },
                          "& .MuiInputBase-input": { fontSize: 13 },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: { sm: 140, md: 160 } }}>
                      <TextField
                        type="number"
                        size="small"
                        value={bill.currentBalance}
                        onChange={(e) =>
                          handleEditBillChange(
                            idx,
                            "currentBalance",
                            e.target.value
                          )
                        }
                        inputProps={{ min: 0, step: 1 }}
                        sx={{
                          maxWidth: { sm: 140, md: 160 },
                          "& .MuiInputBase-input": { fontSize: 13 },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleEditDeleteBill(idx)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Card
          sx={{
            mt: 3,
            p: { xs: 2, sm: 3 },
            backgroundColor: "white",
            border: "1px solid rgba(37,99,235,0.15)",
            boxShadow: "none",
          }}
        >
          <Box sx={{ overflow: "auto", maxHeight: 800 }}>
            <Table sx={{ minWidth: 800 }} size="small" stickyHeader>
              <TableHead
                sx={{
                  "& .MuiTableCell-head": {
                    background:
                      "linear-gradient(135deg, rgba(102,126,234) 0%, rgba(71,94,194) 100%)",
                    color: "#ffffff",
                    borderBottom: "1px solid rgba(37,99,235,0.3)",
                  },
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      background:
                        "linear-gradient(135deg, rgb(102,126,234) 0%, rgb(71,94,194) 100%)",
                      zIndex: 2,
                      color: "#ffffff",
                    }}
                  >
                    Month
                  </TableCell>
                  {sortedBills.map((b, idx) => (
                    <TableCell key={idx} align="center">
                      <Typography variant="subtitle2">{b.name}</Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Typography variant="caption">
                          Rate: {b.interestRate}%
                        </Typography>
                        <Typography variant="caption">
                          Payment: ${b.monthlyPayment}/mo
                        </Typography>
                        <Typography variant="caption">
                          Balance: ${b.currentBalance}
                        </Typography>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: maxMonths }, (_, m) => (
                  <TableRow key={m} hover>
                    <TableCell
                      sx={{
                        position: "sticky",
                        left: 0,
                        background: "#eef2ff",
                        zIndex: 1,
                        color: "#1e293b",
                      }}
                    >
                      Month {m + 1}
                    </TableCell>
                    {calculation.map((debt, idx) => {
                      const monthData = debt.months[m];
                      const payoffIdx = debt.months.findIndex(
                        (mm, i) =>
                          mm.remainingBalance === 0 &&
                          (i === 0 || debt.months[i - 1].remainingBalance > 0)
                      );
                      const isSnowballed = payoffIdx !== -1 && m > payoffIdx;
                      return (
                        <TableCell
                          key={idx}
                          align="center"
                          sx={{
                            backgroundColor: isSnowballed
                              ? "#e8f5e9"
                              : undefined,
                          }}
                        >
                          {isSnowballed ? (
                            <Typography
                              variant="body2"
                              color="black"
                              fontWeight={600}
                            >
                              Snowballed
                            </Typography>
                          ) : monthData ? (
                            <Box>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                justifyContent="center"
                                alignItems="center"
                              >
                                <Typography variant="body2">
                                  Pay: ${monthData.payment.toFixed(2)}
                                </Typography>
                                <Tooltip title={monthData.info} placement="top">
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "text-gray-400",
                                      cursor: "default",
                                    }}
                                  >
                                    ℹ️
                                  </Typography>
                                </Tooltip>
                              </Stack>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Balance: $
                                {monthData.remainingBalance.toFixed(2)}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Principal: $
                                  {monthData.principalPaid.toFixed(2)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Interest: ${monthData.interestPaid.toFixed(2)}
                                </Typography>
                                {monthData.rollover > 0 && (
                                  <Typography
                                    variant="caption"
                                    color="warning.main"
                                    fontWeight={600}
                                  >
                                    Rollover: ${monthData.rollover.toFixed(2)}
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          ) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}
    </Box>
  );
}
