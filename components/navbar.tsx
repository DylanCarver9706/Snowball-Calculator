"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import SubscriptionModal from "./subscriptionModal";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  // Handler to close mobile menu when an item is clicked
  const handleMobileItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop navbar */}
        <div className="flex h-16">
          <div className="w-48 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold text-theme-600">Snowball</span>
              <span className="text-3xl font-bold text-gray-900">
                Calculator
              </span>
            </Link>
          </div>

          {/* Desktop navigation links */}
          <div className="flex-1 flex justify-center items-center">
            <div className="hidden md:flex space-x-1">
              <Link href="/calculate">
                <Button variant="ghost" className="text-gray-700 text-md">
                  CALCULATE
                </Button>
              </Link>
            </div>
          </div>

          {/* Right section - authentication buttons */}
          <div className="w-48 flex items-center justify-end">
            {/* Mobile menu button */}
            <button
              className="md:hidden mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {!isSignedIn && isLoaded && (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="text-base">
                    Login
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    // setShowSubscribeModal(true);
                    router.push("/sign-up");
                  }}
                  className="bg-theme-600 hover:bg-theme-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {isSignedIn && isLoaded && (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none bg-transparent">
                    <User className="h-7 w-7 ml-[-135px] stroke-[hsl(0, 0.00%, 0.00%)] hover:stroke-theme-600 transition-colors" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2 p-2 bg-white border border-[hsl(222,47%,25%)] space-y-1"
                  >
                    <DropdownMenuItem
                      asChild
                      className="px-4 py-3 cursor-pointer text-black hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                    >
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem
                      asChild
                      className="px-4 py-3 cursor-pointer text-black hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                    >
                      <Link href="/subscription">Subscription</Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="px-4 py-3 cursor-pointer text-theme-600 hover:text-theme-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu - Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-16 right-0 z-50 bg-white shadow-lg">
            <div className="flex flex-col space-y-2 p-4">
              <Link href="/calculate" onClick={handleMobileItemClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-center text-center text-gray-700"
                >
                  CALCULATE
                </Button>
              </Link>

              {!isSignedIn && isLoaded && (
                <div className="pt-2 flex flex-col space-y-2 border-t border-gray-100">
                  <Link
                    href="/sign-in"
                    className="w-full"
                    onClick={handleMobileItemClick}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-center"
                    >
                      Login
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      // setShowSubscribeModal(true);
                      router.push("/sign-up");
                      handleMobileItemClick();
                    }}
                    className="w-full bg-theme-600 hover:bg-theme-700 text-white justify-center text-center"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {isSignedIn && isLoaded && (
                <div className="pt-2 flex flex-col space-y-2 border-t border-gray-100">
                  <Link href="/profile" onClick={handleMobileItemClick}>
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-center"
                    >
                      Profile
                    </Button>
                  </Link>
                  {/* <Link href="/subscription" onClick={handleMobileItemClick}>
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-center"
                    >
                      Subscription
                    </Button>
                  </Link> */}
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-center text-theme-600"
                    onClick={() => {
                      signOut();
                      handleMobileItemClick();
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <SubscriptionModal
        open={showSubscribeModal}
        onOpenChange={setShowSubscribeModal}
      />
    </nav>
  );
}
