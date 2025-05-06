"use client";

import { useUser, SignUpButton } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import PricingFeatures from "./pricingFeatures";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionModal({
  open,
  onOpenChange,
}: SubscriptionModalProps) {
  const { isSignedIn } = useUser();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto w-[95%] bg-white border-2 border-theme-700 p-3 sm:p-5 rounded-[8px]"
        aria-describedby="subscription-description"
      >
        <DialogHeader className="space-y-4 sm:space-y-8">
          <DialogTitle className="text-2xl sm:text-4xl font-bold text-center text-black">
            Unlock Premium PDF Tools
          </DialogTitle>
          <DialogDescription id="subscription-description" className="sr-only">
            Subscribe to unlock unlimited access to all PDF tools and advanced
            features
          </DialogDescription>
        </DialogHeader>

        <div className="text-center space-y-4 sm:space-y-6">
          <div className="text-black text-lg sm:text-xl leading-relaxed px-2">
            {isSignedIn
              ? "Get unlimited access to all PDF tools and advanced features"
              : "Subscribe now to unlock unlimited access to all PDF tools and advanced features!"}
          </div>

          {/* Pricing Section */}
          <div className="bg-gray-100 rounded-2xl p-4 sm:p-8 mt-4 sm:mt-6">
            <div className="flex flex-col items-center gap-0">
              <div className="flex items-baseline justify-center gap-2 text-black">
                <span className="text-4xl sm:text-5xl font-bold">$9.99</span>
                <span className="text-lg sm:text-xl text-black">/ month</span>
              </div>
              <PricingFeatures />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:gap-5 mt-2">
          <DialogClose asChild>
            <div className="text-2xl sm:text-4xl text-white bg-theme-600 hover:bg-theme-700 p-4 sm:p-8 rounded-xl w-full max-w-md mx-auto flex justify-center items-center cursor-pointer">
              <SignUpButton />
            </div>
          </DialogClose>
        </div>
        <div className="text-black text-xs sm:text-sm flex flex-col items-center mt-2">
          Cancel anytime. Secure payment via Stripe.
        </div>
      </DialogContent>
    </Dialog>
  );
}
