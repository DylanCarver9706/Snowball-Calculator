export interface Bill {
  name: string;
  interestRate: number;
  monthlyPayment: number;
  currentBalance: number;
}

export interface SnowballMonth {
  month: number;
  bills: {
    [billId: string]: {
      payment: number;
      remainingBalance: number;
      interestPaid: number;
      principalPaid: number;
    };
  };
  totalPaid: number;
  snowballAmount: number;
}

export interface SnowballCalculation {
  monthlyContribution: number;
  bills: Bill[];
  months: SnowballMonth[];
}
