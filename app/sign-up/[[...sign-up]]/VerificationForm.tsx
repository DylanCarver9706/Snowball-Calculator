import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createSubscription } from "@/app/services/api";

const VerificationForm = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (!isLoaded && !signUp) return null;

    try {
      const signInAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signInAttempt.status === "complete") {
        const cardToken = signUp.unsafeMetadata?.cardToken as string;
        const priceId = signUp.unsafeMetadata?.priceId as string;

        if (!cardToken || !priceId) {
          throw new Error("Missing card token or price ID");
        }

        // Use the service function instead of direct fetch
        await createSubscription({
          cardToken,
          priceId,
          email: signUp.emailAddress as string,
          userId: signUp.createdUserId as string,
        });

        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/");
      } else {
        alert(
          "Verification not complete. Please check your code and try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during verification and payment setup.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-20 flex items-center justify-center">
      <form onSubmit={handleVerification}>
        <Card className="w-full sm:w-96">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Welcome! Please fill in the details to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-y-4">
            <div>
              <Label htmlFor="code">Enter your verification code</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                id="code"
                name="code"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button type="submit" disabled={!isLoaded || loading}>
                {loading ? "Loading..." : "Verify"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default VerificationForm;
