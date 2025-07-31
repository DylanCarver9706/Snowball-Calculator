import { SnowballCalculator } from "@/components/snowball-calculator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24">
      <div className="z-10 w-full max-w-8xl items-center justify-between font-mono text-sm">
        <SnowballCalculator />
      </div>
    </main>
  );
}
