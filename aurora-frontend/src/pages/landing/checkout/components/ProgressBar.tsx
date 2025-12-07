import { Check } from "lucide-react";
import type { CheckoutStep } from "../index";

interface ProgressBarProps {
  currentStep: CheckoutStep;
}

const steps = [
  { number: 1, label: "CONFIRM BOOKING" },
  { number: 2, label: "EXTRAS" },
  { number: 3, label: "GUEST DETAILS" },
  { number: 4, label: "PAYMENT" },
];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = step.number as CheckoutStep;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-primary border-primary text-white"
                      : isCurrent
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent || isCompleted
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

