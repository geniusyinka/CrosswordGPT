'use client';

interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="fixed top-4 right-6 left-6 md:left-auto md:w-64">
      <div className="bg-gray-100 rounded-full h-4 shadow-inner">
        <div 
          className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-center text-sm text-gray-600 mt-1">
        {percentage}% Complete
      </p>
    </div>
  );
}
