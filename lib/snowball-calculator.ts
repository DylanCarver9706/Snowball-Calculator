import { Bill } from "./types";

// Type for each month's data for a debt
export interface DebtMonth {
  payment: number;
  remainingBalance: number;
  principalPaid: number;
  interestPaid: number;
  usedSnowball: boolean;
  rollover: number;
  info: string;
}

// Type for the output structure
export interface DebtWithSchedule extends Bill {
  months: DebtMonth[];
}

// Main snowball calculation
export function calculateSnowball(
  debts: Bill[],
  monthlyExtra: number
): DebtWithSchedule[] {
  // No sorting here; process debts in the order provided
  const debtSchedules: DebtWithSchedule[] = debts.map((debt) => ({
    ...debt,
    months: [],
  }));

  // 3. Track freed minimums
  let freedMinimums = 0;
  let month = 0;
  let allPaidOff = false;

  // 4. Track payoff month for each debt
  const payoffMonth: number[] = Array(debtSchedules.length).fill(Infinity);

  // 5. Track current balances
  let balances = debtSchedules.map((d) => d.currentBalance);

  // 6. Loop until all debts are paid off or safety cap
  while (!allPaidOff && month < 1000) {
    let snowballUsed = false;
    let localFreed = freedMinimums;
    let available = 0;
    let i = 0;
    // Find the first unpaid debt
    while (i < debtSchedules.length && balances[i] <= 0) i++;
    // For the first unpaid debt, available = min + freed + snowball
    if (i < debtSchedules.length) {
      available = debtSchedules[i].monthlyPayment + localFreed + monthlyExtra;
      snowballUsed = true;
    }
    // For each debt in order
    for (let j = i; j < debtSchedules.length; j++) {
      const debt = debtSchedules[j];
      // If already paid off, push snowballed cell
      if (balances[j] <= 0) {
        debt.months.push({
          payment: 0,
          remainingBalance: 0,
          principalPaid: 0,
          interestPaid: 0,
          usedSnowball: false,
          rollover: 0,
          info: "This debt is already paid off.",
        });
        continue;
      }
      let infoParts: string[] = [];
      let minPart = `Min payment: $${debt.monthlyPayment.toFixed(2)}`;
      let freedPart = "";
      let snowballPart = "";
      let rolloverPart = "";
      let usedSnowball = snowballUsed;
      // For the first unpaid debt, add freedMinimums and snowball
      if (snowballUsed) {
        if (localFreed > 0)
          freedPart = ` + Freed minimums: $${localFreed.toFixed(2)}`;
        snowballPart = ` + Monthly Extra Payment: $${monthlyExtra.toFixed(2)}`;
        snowballUsed = false;
      } else {
        // For subsequent debts, only use min + rollover
        available = debt.monthlyPayment + available;
        if (available > debt.monthlyPayment) {
          rolloverPart = ` + Rollover: $${(
            available - debt.monthlyPayment
          ).toFixed(2)}`;
        }
      }
      // Calculate interest
      const interest = (balances[j] * (debt.interestRate / 100)) / 12;
      // Calculate payment (cannot pay more than balance + interest)
      let payment = Math.min(available, balances[j] + interest);
      const interestPaid = Math.min(interest, payment);
      const principalPaid = payment - interestPaid;
      let newBalance = balances[j] - principalPaid;
      let thisRollover = 0;
      if (payment < available) {
        thisRollover = available - payment;
      }
      // Build info string
      infoParts.push(minPart, freedPart, rolloverPart, snowballPart);
      infoParts = infoParts.filter(Boolean);
      let info = `Paid = ${infoParts.join("")}`;
      if (thisRollover > 0) {
        info += `. Rollover $${thisRollover.toFixed(
          2
        )} applied to next debt in this month.`;
      }
      // Save this month's data
      debt.months.push({
        payment,
        remainingBalance: newBalance < 0 ? 0 : newBalance,
        principalPaid,
        interestPaid,
        usedSnowball,
        rollover: thisRollover,
        info,
      });
      // If paid off, add min payment to freedMinimums for future months
      if (
        (newBalance < 0 ? 0 : newBalance) === 0 &&
        payoffMonth[j] === Infinity
      ) {
        localFreed += debt.monthlyPayment;
        payoffMonth[j] = month;
      }
      // Rollover is only for the next debt in the same month
      available = thisRollover;
      balances[j] = newBalance < 0 ? 0 : newBalance;
    }
    freedMinimums = localFreed;
    // Check if all debts are paid off
    allPaidOff = balances.every((b) => b <= 0);
    month++;
  }
  return debtSchedules;
}
