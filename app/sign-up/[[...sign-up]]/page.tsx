"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import VerificationForm from "./VerificationForm";
import SignUpForm from "./SignUpForm";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  const [verifying, setVerifying] = useState(false);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  if (verifying) {
    return <VerificationForm />;
  }

  return (
    <div className="mt-20 flex items-center justify-center">
      {/* @ts-ignore */}
      <Elements stripe={stripePromise}>
        {/* <SignUpForm setVerifying={setVerifying} /> */}
        <SignUp redirectUrl="/calculate" />
      </Elements>
    </div>
  );
};

export default SignUpPage;
