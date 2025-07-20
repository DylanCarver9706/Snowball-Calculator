import { SnowballCalculator } from "@/components/snowball-calculator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-8xl w-full items-center justify-between font-mono text-sm">
        <SnowballCalculator />
      </div>
    </main>
  );
}
