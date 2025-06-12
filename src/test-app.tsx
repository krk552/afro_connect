import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const TestApp = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Afro-Connect Test Page</h1>
        <p className="text-gray-600 mb-4">
          If you can see this page, basic React rendering is working correctly.
        </p>
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <div className="text-sm">
            {Object.entries(import.meta.env)
              .filter(([key]) => key.startsWith('VITE_'))
              .map(([key, value]) => (
                <div key={key} className="mb-1">
                  <span className="font-medium">{key}:</span> {String(value)}
                </div>
              ))}
          </div>
        </div>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={() => alert('Button click works!')}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

// Try to render the test app
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    document.body.innerHTML = '<div style="color: red; padding: 20px;">Error: Root element not found!</div>';
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <TestApp />
      </React.StrictMode>
    );
  }
} catch (error) {
  console.error('Error rendering test app:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error instanceof Error ? error.message : String(error)}</div>`;
}
