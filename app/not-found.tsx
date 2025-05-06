"use client";

import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Component that uses useSearchParams
function NotFoundContent() {
  const searchParams = useSearchParams();
  return (
    <>
      <div className="min-h-[calc(100vh-75px)] bg-gradient-to-b from-white to-gray-50 pt-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-theme-100 rounded-full">
              <FileQuestion className="h-16 w-16 text-theme-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Whoops! This page isn&apos;t found or this feature isn&apos;t quite
            ready yet
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Don&apos;t worry! You can head back to our homepage and explore our
            available PDF tools.
          </p>
          <Link href="/">
            <Button className="bg-theme-600 hover:bg-theme-700 text-white px-8 py-6 text-lg h-auto">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default function NotFound() {
  return <NotFoundContent />;
}
