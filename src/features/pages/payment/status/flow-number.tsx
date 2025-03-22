import { TRANSACTION_FLOW } from '@/types/transaction';
import { stepsTransaction } from '@/utils/product';
import React from 'react';

export function FlowProgress({ status }: { status: TRANSACTION_FLOW }) {
  // Find current step index
  const currentStepIndex = stepsTransaction.findIndex(
    (step) => step.id === status
  );

  return (
    <div className="w-full py-20 md:flex md:flex-col hidden">
      <h2 className="text-lg  mb-6 text-center">Progress Transaksi</h2>

      <div className="flex items-center justify-between">
        {stepsTransaction.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          const circleColor =
            isCompleted || isActive
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-gray-200 ring-2 ring-gray-900';

          const textColor =
            isCompleted || isActive ? 'text-green-500' : 'text-gray-500';

          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative flex-1"
            >
              {/* Left connector (not for first step) */}
              {index > 0 && (
                <div className="absolute left-0 right-1/2 top-6">
                  <div
                    className={`h-1 w-full ${
                      isActive || isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  ></div>
                </div>
              )}

              {/* Right connector (not for last step) */}
              {index < stepsTransaction.length - 1 && (
                <div className="absolute left-1/2 right-0 top-6">
                  <div
                    className={`h-1 w-full ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  ></div>
                </div>
              )}

              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${circleColor}`}
              >
                <StepIcon className="w-6 h-6" />
              </div>

              {/* Step Text */}
              <div className="mt-2 text-center">
                <p className={`font-medium ${textColor}`}>{step.label}</p>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FlowProgress;
