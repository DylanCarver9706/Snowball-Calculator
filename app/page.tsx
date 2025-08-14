"use client";

import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  Stack,
} from "@mui/material";
import {
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import SnowballCarouselAnimation from "@/components/SnowballCarouselAnimation";

export default function HomePage() {
  const benefits = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Build Momentum",
      description:
        "Start with your smallest debt and gain confidence as you see progress.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Pay Off Faster",
      description:
        "Focus your extra payments on one debt at a time for maximum impact.",
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
      title: "Stay Motivated",
      description:
        "See your debt-free date and track your journey to financial freedom.",
    },
  ];

  const features = [
    "Easy debt entry",
    "Visual progress tracking",
    "Payment schedule generation",
    "Debt-free date calculator",
    "Mobile-friendly interface",
    "Secure and private",
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          color: "white",
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Dave Ramsey Snowball Calculator
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ mb: 3, opacity: 0.9 }}
              >
                Use the Dave Ramsey Snowball Method to eliminate your debt and
                achieve financial freedom.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <SignInButton mode="modal">
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "white",
                      color: "#2563eb",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Start Your Debt-Free Journey
                  </Button>
                </SignInButton>
                <Button
                  component={Link}
                  href="/how-it-works"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Learn How It Works
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 400,
                }}
              >
                <SnowballCarouselAnimation />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ backgroundColor: "#f8fafc", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ color: "#1e293b" }}
          >
            Why the Snowball Method Works
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 6, color: "#64748b" }}
          >
            The psychology behind Dave Ramsey's proven debt payoff strategy
          </Typography>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 3,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      transition: "transform 0.3s ease-in-out",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#1e293b" }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography sx={{ color: "#64748b" }}>
                    {benefit.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          textAlign: "center",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ color: "white" }}
          >
            Ready to Start Your Debt-Free Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, color: "white" }}>
            Join thousands of people who have used this method to get out of
            debt faster.
          </Typography>
          <SignInButton mode="modal">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: "white",
                color: "#2563eb",
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Get Started Now
            </Button>
          </SignInButton>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: "#f8fafc", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ color: "#1e293b" }}
            >
              Everything You Need to Succeed
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "#64748b" }}>
              Our comprehensive calculator provides all the tools you need to
              create and stick to your debt payoff plan.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: "sm", mx: "auto", mb: 2 }}>
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon sx={{ color: "#2563eb" }} />
                    <Typography sx={{ color: "#1e293b" }}>{feature}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #667eea 0%,rgb(71, 94, 194) 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Don't Wait to Start
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Every day you wait is another day in debt. Start your journey to
            financial freedom today.
          </Typography>
          <SignInButton mode="modal">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "white",
                color: "#2563eb",
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Start Now - It's Free
            </Button>
          </SignInButton>
        </Container>
      </Box>
    </Box>
  );
}
