import React from 'react';

export const TestPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Dashboard is Working!</h1>
      <p className="text-lg text-gray-600 mb-4">
        If you can see this page, the dashboard is running correctly.
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Server Status</h2>
        <ul className="text-green-700 space-y-1">
          <li>✅ React application loaded</li>
          <li>✅ Vite development server running</li>
          <li>✅ TypeScript compilation successful</li>
          <li>✅ Tailwind CSS styles applied</li>
        </ul>
      </div>
      <div className="mt-6">
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TestPage;