import { createRoot } from 'react-dom/client'
import './index.css'

const TestApp = () => {
  return (
    <div className="p-8 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Afro-Connect Debug Page</h1>
      <p className="mb-4">If you can see this, the basic React rendering is working.</p>
      <div className="p-4 bg-gray-100 rounded-md mb-4">
        <h2 className="text-xl font-semibold mb-2">Environment Variables:</h2>
        <pre className="whitespace-pre-wrap text-sm">
          {Object.entries(import.meta.env).map(([key, value]) => 
            key.startsWith('VITE_') ? `${key}: ${value}\n` : ''
          )}
        </pre>
      </div>
    </div>
  );
};

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found!");
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found!</div>';
  } else {
    createRoot(rootElement).render(<TestApp />);
  }
} catch (error) {
  console.error("Rendering error:", error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">Error: ${error instanceof Error ? error.message : String(error)}</div>`;
}
