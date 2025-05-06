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

export function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <span className="text-3xl font-bold text-theme-600">PDF</span>
              <span className="text-3xl font-bold text-gray-900">Utils</span>
            </Link>
          </div>

          {/* Desktop navigation links */}
          <div className="flex-1 flex justify-center items-center">
            <div className="hidden md:flex space-x-1">
              <Link href="/merge-pdf">
                <Button variant="ghost" className="text-gray-700 text-md">
                  MERGE PDF
                </Button>
              </Link>
              <Link href="/split-pdf">
                <Button variant="ghost" className="text-gray-700 text-md">
                  SPLIT PDF
                </Button>
              </Link>
              <Link href="/compress-pdf">
                <Button variant="ghost" className="text-gray-700 text-md">
                  COMPRESS PDF
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 text-md flex items-center"
                  >
                    CONVERT PDF <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-40 p-2 bg-white border border-gray-200 space-y-1"
                >
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-jpg">PDF to JPG</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-png">PDF to PNG</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-word">PDF to WORD</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-powerpoint">PDF to POWERPOINT</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 text-md flex items-center"
                  >
                    ALL PDF TOOLS <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-48 p-2 bg-white border border-gray-200 space-y-1"
                >
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/merge-pdf">Merge PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/split-pdf">Split PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/compress-pdf">Compress PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-jpg">PDF to JPG</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-png">PDF to PNG</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-word">PDF to WORD</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-powerpoint">PDF to POWERPOINT</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  onClick={() => setShowSubscribeModal(true)}
                  className="bg-theme-600 hover:bg-theme-700 text-white"
                >
                  Unlock Pro
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
                    <DropdownMenuItem
                      asChild
                      className="px-4 py-3 cursor-pointer text-black hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                    >
                      <Link href="/subscription">Subscription</Link>
                    </DropdownMenuItem>
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
              <Link href="/split-pdf" onClick={handleMobileItemClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-center text-center text-gray-700"
                >
                  SPLIT PDF
                </Button>
              </Link>
              <Link href="/merge-pdf" onClick={handleMobileItemClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-center text-center text-gray-700"
                >
                  MERGE PDF
                </Button>
              </Link>
              <Link href="/compress-pdf" onClick={handleMobileItemClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-center text-center text-gray-700"
                >
                  COMPRESS PDF
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-center text-gray-700 flex items-center"
                  >
                    CONVERT PDF <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-40 p-2 bg-white border border-gray-200 space-y-1"
                >
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-jpg" onClick={handleMobileItemClick}>
                      PDF to JPG
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-png" onClick={handleMobileItemClick}>
                      PDF to PNG
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-word" onClick={handleMobileItemClick}>
                      PDF to WORD
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link
                      href="/pdf-to-powerpoint"
                      onClick={handleMobileItemClick}
                    >
                      PDF to POWERPOINT
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-center text-gray-700 flex items-center"
                  >
                    ALL PDF TOOLS <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-48 p-2 bg-white border border-gray-200 space-y-1"
                >
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/merge-pdf" onClick={handleMobileItemClick}>
                      Merge PDF
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/split-pdf" onClick={handleMobileItemClick}>
                      Split PDF
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/compress-pdf" onClick={handleMobileItemClick}>
                      Compress PDF
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-jpg" onClick={handleMobileItemClick}>
                      PDF to JPG
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-png" onClick={handleMobileItemClick}>
                      PDF to PNG
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link href="/pdf-to-word" onClick={handleMobileItemClick}>
                      PDF to WORD
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="px-4 py-3 cursor-pointer text-gray-700 hover:bg-gray-100 focus:bg-gray-100 rounded-md transition-colors flex items-center justify-center no-underline"
                  >
                    <Link
                      href="/pdf-to-powerpoint"
                      onClick={handleMobileItemClick}
                    >
                      PDF to POWERPOINT
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
                      setShowSubscribeModal(true);
                      handleMobileItemClick();
                    }}
                    className="w-full bg-theme-600 hover:bg-theme-700 text-white justify-center text-center"
                  >
                    Unlock Pro
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
                  <Link href="/subscription" onClick={handleMobileItemClick}>
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-center"
                    >
                      Subscription
                    </Button>
                  </Link>
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
