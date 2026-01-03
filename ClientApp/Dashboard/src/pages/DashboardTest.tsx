import React from 'react';

export const DashboardTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard Test Page
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        If you can see this, the React app is working correctly.
      </p>
      <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          Debug Information:
        </h2>
        <ul className="mt-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• React is rendering</li>
          <li>• Tailwind CSS is working</li>
          <li>• Dark mode classes are applied</li>
          <li>• Component structure is correct</li>
        </ul>
      </div>
    </div>
  );
};