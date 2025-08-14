"use client";

import { Container, Typography, Box } from "@mui/material";
import { SnowballCalculator } from "@/components/SnowballCalculator";

export default function CalculatorPage() {
  return (
    <Box sx={{ backgroundColor: "white", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
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
            Snowball Calculator
          </Typography>
          <Typography variant="h5" textAlign="center" sx={{ opacity: 0.9 }}>
            Create your personalized debt payoff plan using the Dave Ramsey
            snowball method
          </Typography>
        </Container>
      </Box>

      {/* Calculator */}
      <Container maxWidth="lg" sx={{ py: 8, backgroundColor: "white" }}>
        <SnowballCalculator />
      </Container>
    </Box>
  );
}
