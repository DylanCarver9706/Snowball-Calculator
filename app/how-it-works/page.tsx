"use client";

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { SignInButton } from "@clerk/nextjs";

export default function HowItWorksPage() {
  const steps = [
    {
      label: "List All Your Debts",
      description:
        "Start by listing all your debts from smallest to largest balance, regardless of interest rate.",
      number: 1,
    },
    {
      label: "Pay Minimums on All Debts",
      description:
        "Continue making minimum payments on all your debts to avoid late fees and penalties.",
      number: 2,
    },
    {
      label: "Attack the Smallest Debt",
      description:
        "Put every extra dollar toward your smallest debt until it's completely paid off.",
      number: 3,
    },
    {
      label: "Roll Over Payments",
      description:
        "Once a debt is paid off, take that payment amount and add it to the next smallest debt.",
      number: 4,
    },
  ];

  const benefits = [
    "Builds momentum and motivation",
    "Provides quick wins to stay encouraged",
    "Simplifies your debt payoff strategy",
    "More money back in your pocket each month",
    "Helps you stay focused on one goal at a time",
  ];

  const example = [
    { debt: "Credit Card A", balance: 500, payment: 50 },
    { debt: "Personal Loan", balance: 2000, payment: 100 },
    { debt: "Car Loan", balance: 15000, payment: 300 },
    { debt: "Student Loan", balance: 25000, payment: 200 },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%, rgb(71, 94, 194) 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            How the Snowball Method Works
          </Typography>
          <Typography variant="h5" textAlign="center" sx={{ opacity: 0.9 }}>
            The psychology behind Dave Ramsey's proven debt payoff strategy
          </Typography>
        </Container>
      </Box>

      {/* Method Explanation */}
      <Box sx={{ backgroundColor: "#f8fafc", py: 8 }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={6}
            alignItems="flex-start"
            justifyContent="center"
          >
            <Grid item xs={12} md={7} sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 520, mx: "auto", textAlign: "center" }}
              >
                The Snowball Method is a debt payoff strategy popularized
                by Dave Ramsey where you pay off your debts in order of smallest
                to largest debt balance, instead of interest rate. As each debt
                is paid off, you roll the payment amount into the next debt.
              </Typography>

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <SignInButton mode="modal">
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ mr: 2 }}
                  >
                    Try the Calculator
                  </Button>
                </SignInButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                Why This Method Works:
              </Typography>
              <List
                sx={{ px: 0, m: 0, maxWidth: 520, mx: { xs: "auto", md: 0 } }}
              >
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Step-by-Step Process */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%, rgb(71, 94, 194) 100%)",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ color: "white" }}
          >
            The 4-Step Process
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 6, color: "rgba(255,255,255,0.85)" }}
          >
            Follow these steps to implement the snowball method
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Stepper
              orientation="vertical"
              sx={{
                maxWidth: 720,
                width: "100%",
                mx: "auto",
                "& .MuiStepLabel-label": { color: "rgba(255,255,255,0.9)" },
                "& .MuiStepLabel-label.Mui-active": { color: "#fff" },
                "& .MuiStepConnector-line": {
                  borderColor: "rgba(255,255,255,0.35)",
                },
              }}
            >
              {steps.map((step, index) => (
                <Step key={index} active={true}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          // borderRadius: "50%",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#475ec2",
                          fontWeight: 800,
                          fontSize: "1rem",
                        }}
                      >
                        {step.number}
                      </Box>
                    )}
                  >
                    <Typography variant="h6">{step.label}</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography sx={{ mb: 2, color: "rgba(255,255,255,0.85)" }}>
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Container>
      </Box>

      {/* Traditional vs Snowball Comparison */}
      <Box sx={{ backgroundColor: "#f8fafc", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Traditional Debt Payoff vs Snowball Method
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            See how your focus changes your momentum and your payoff timeline
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h5" gutterBottom>
                  Traditional: Smallest Debt Balance First
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 5 }}>
                  Focus extra payments on the largest interest rate first.
                </Typography>
                <Typography variant="h6" mb={2} gutterBottom>
                  $500/ month extra payment
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small" aria-label="traditional order">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order</TableCell>
                        <TableCell align="left">Debt</TableCell>
                        <TableCell align="right">Balance</TableCell>
                        <TableCell align="right">Rate %</TableCell>
                        <TableCell align="right">Min. Payment</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Sorted by balance (smallest first) */}
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell align="right">$20,000</TableCell>
                        <TableCell align="right">26%</TableCell>
                        <TableCell align="right">$250</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>Store Card</TableCell>
                        <TableCell align="right">$1,200</TableCell>
                        <TableCell align="right">15%</TableCell>
                        <TableCell align="right">$45</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>3</TableCell>
                        <TableCell>Personal Loan</TableCell>
                        <TableCell align="right">$10,000</TableCell>
                        <TableCell align="right">8%</TableCell>
                        <TableCell align="right">$500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>4</TableCell>
                        <TableCell>Car Loan</TableCell>
                        <TableCell align="right">$30,000</TableCell>
                        <TableCell align="right">6%</TableCell>
                        <TableCell align="right">$650</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>5</TableCell>
                        <TableCell>Medical Bill</TableCell>
                        <TableCell align="right">$3,500</TableCell>
                        <TableCell align="right">0%</TableCell>
                        <TableCell align="right">$150</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Snowball: Smallest Minimum Payment First
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Focus extra payments on the smallest balance first, then roll
                  that minimum payment amount forward.
                </Typography>
                <Typography variant="h6" mb={2} gutterBottom>
                  $500/ month extra payment + Freed min. payments
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small" aria-label="snowball order">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order</TableCell>
                        <TableCell align="left">Debt</TableCell>
                        <TableCell align="right">Balance</TableCell>
                        <TableCell align="right">Rate %</TableCell>
                        <TableCell align="right">Min. Payment</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Sorted by min payment (smallest first) */}
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>Store Card</TableCell>
                        <TableCell align="right">$1,200</TableCell>
                        <TableCell align="right">15%</TableCell>
                        <TableCell align="right">$45</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>Medical Bill</TableCell>
                        <TableCell align="right">$3,500</TableCell>
                        <TableCell align="right">0%</TableCell>
                        <TableCell align="right">$150</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>3</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell align="right">$20,000</TableCell>
                        <TableCell align="right">26%</TableCell>
                        <TableCell align="right">$250</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>4</TableCell>
                        <TableCell>Personal Loan</TableCell>
                        <TableCell align="right">$10,000</TableCell>
                        <TableCell align="right">8%</TableCell>
                        <TableCell align="right">$500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>5</TableCell>
                        <TableCell>Car Loan</TableCell>
                        <TableCell align="right">$30,000</TableCell>
                        <TableCell align="right">6%</TableCell>
                        <TableCell align="right">$650</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%, rgb(71, 94, 194) 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Your Snowball?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Our calculator will help you create a personalized debt payoff plan
            using the snowball method.
          </Typography>
          <SignInButton mode="modal">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "grey.100",
                },
              }}
            >
              Start Your Debt-Free Journey
            </Button>
          </SignInButton>
        </Container>
      </Box>
    </Box>
  );
}
