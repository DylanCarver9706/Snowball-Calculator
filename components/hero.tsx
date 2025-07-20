"use client";

import { Calculator, TrendingUp, Edit3 } from "lucide-react";

export function Hero() {
  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold mt-[-25px] tracking-tight text-gray-900 sm:text-6xl mb-6">
          Debt Snowball Calculator
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Visualize and optimize your debt payoff journey. See a month-by-month
          breakdown, edit your debts, and understand how the snowball method
          accelerates your path to financial freedom.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Snowball Payoff Table
            </h3>
            <p className="text-gray-600">
              See a detailed, month-by-month payoff schedule for all your debts
              using the snowball method.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Watch your progress accelerate as you pay off debts and roll freed
              payments into the next balance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Edit3 className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fully Editable</h3>
            <p className="text-gray-600">
              Add, remove, or edit debts and payments. Customize your plan and
              see instant results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
