"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ReactivateSubForm from "./ReactivateSubForm";
import {
  checkSubscription,
  cancelSubscription,
  reactivateSubscription,
} from "@/app/services/api";

interface SubscriptionInfo {
  isActive: boolean;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export default function SubscriptionPage() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [pendingSubscriptionId, setPendingSubscriptionId] = useState<
    string | null
  >(null);
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  useEffect(() => {
    fetchSubscriptionInfo();
    // eslint-disable-next-line
  }, [user?.publicMetadata?.stripeSubscriptionId]);

  const fetchSubscriptionInfo = async () => {
    if (!user?.publicMetadata?.stripeSubscriptionId) return;

    try {
      const data = await checkSubscription(
        user.publicMetadata.stripeSubscriptionId as string
      );
      setSubscriptionInfo(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    const activeSubscriptionId =
      user?.publicMetadata?.stripeSubscriptionId || pendingSubscriptionId;

    if (!activeSubscriptionId) {
      toast.error("Error", {
        description: "No active subscription found to cancel.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use service function
      await cancelSubscription(activeSubscriptionId as string);

      // Refresh subscription info after cancellation
      const newSubscriptionInfo = await checkSubscription(
        activeSubscriptionId as string
      );
      setSubscriptionInfo(newSubscriptionInfo);

      toast.success("Subscription cancelled", {
        description:
          "Your subscription will end at the end of the billing period",
      });
    } catch (error: unknown) {
      toast.error("Error", {
        description: "Failed to cancel subscription. Please try again.",
      });
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to reactivate your subscription?\n\nYour default payment method will be charged at the start of the next billing cycle.\n\nThis will be the same price as your current subscription."
      )
    ) {
      return;
    }

    const activeSubscriptionId =
      user?.publicMetadata?.stripeSubscriptionId || pendingSubscriptionId;

    if (!activeSubscriptionId) return;

    setIsReactivating(true);
    try {
      // Use service function
      await reactivateSubscription(activeSubscriptionId as string);

      // Refresh subscription info after reactivation
      const newSubscriptionInfo = await checkSubscription(
        activeSubscriptionId as string
      );
      setSubscriptionInfo(newSubscriptionInfo);

      toast.success("Subscription reactivated", {
        description: "Your subscription has been successfully reactivated",
      });
    } catch (error: unknown) {
      toast.error("Error", {
        description: "Failed to reactivate subscription. Please try again.",
      });
      console.error("Error:", error);
    } finally {
      setIsReactivating(false);
    }
  };

  const handleSubscriptionSuccess = async (subscriptionResult: {
    subscriptionId: string;
    customerId: string;
  }) => {
    try {
      // Hide the subscription form
      setShowSubscribeModal(false);

      // Since Clerk metadata may not be updated yet, use the returned subscription ID directly
      if (subscriptionResult && subscriptionResult.subscriptionId) {
        // Store the new subscription ID temporarily
        setPendingSubscriptionId(subscriptionResult.subscriptionId);

        // Fetch subscription info with the new ID
        const newSubscriptionInfo = await checkSubscription(
          subscriptionResult.subscriptionId
        );
        setSubscriptionInfo(newSubscriptionInfo);

        toast.success("Subscription created", {
          description: "Your subscription has been successfully activated",
        });
      }
    } catch (error) {
      console.error("Error refreshing subscription info:", error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Determine which card to show based on multiple factors
  const shouldShowSubscriptionCard =
    (isLoaded && user?.publicMetadata?.stripeSubscriptionId) ||
    (pendingSubscriptionId && subscriptionInfo);

  const shouldShowNoSubscriptionCard =
    isLoaded &&
    !user?.publicMetadata?.stripeSubscriptionId &&
    !pendingSubscriptionId;

  const subscriptionCard = shouldShowSubscriptionCard ? (
    <Card className="bg-white shadow-lg text-center items-center">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-black">
          Active Subscription
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptionInfo && (
          <div className="text-black-200 space-y-2">
            {subscriptionInfo.cancelAtPeriodEnd ? (
              <>
                <p className="text-theme-500 text-lg">
                  Your subscription will end on{" "}
                  <span className="font-medium">
                    {formatDate(subscriptionInfo.currentPeriodEnd)}
                  </span>
                </p>
                <div className="mt-4">
                  <Button
                    onClick={handleReactivateSubscription}
                    disabled={isReactivating}
                    className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-2 mt-4"
                  >
                    {isReactivating
                      ? "Reactivating..."
                      : "Reactivate Subscription"}
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-lg">
                Next billing date:{" "}
                <span className="font-medium">
                  {formatDate(subscriptionInfo.currentPeriodEnd)}
                </span>
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {subscriptionInfo && !subscriptionInfo.cancelAtPeriodEnd && (
          <Button
            variant="destructive"
            onClick={handleCancelSubscription}
            disabled={isLoading}
            className="w-fit text-base px-6 py-2"
          >
            {isLoading ? "Cancelling..." : "Cancel Subscription"}
          </Button>
        )}
      </CardFooter>
    </Card>
  ) : null;

  const noSubscriptionCard = shouldShowNoSubscriptionCard ? (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-black text-center">
          No Active Subscription
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showSubscribeModal && (
          <div className="flex justify-center mb-4">
            <Button
              className="bg-theme-600 hover:bg-theme-700 text-white text-base px-6 py-2"
              onClick={() => setShowSubscribeModal(true)}
            >
              Upgrade to Pro
            </Button>
          </div>
        )}

        {showSubscribeModal && (
          <div className="text-left">
            <Elements stripe={stripePromise}>
              <ReactivateSubForm
                onCancel={() => setShowSubscribeModal(false)}
                onSuccess={handleSubscriptionSuccess}
              />
            </Elements>
          </div>
        )}
      </CardContent>
    </Card>
  ) : null;

  return (
    <main className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Subscription
          </h1>
          <p className="text-xl text-gray-600">
            Manage your PDF Utility subscription and billing details
          </p>
        </div>
        {subscriptionCard}
        {noSubscriptionCard}
      </div>
    </main>
  );
}
