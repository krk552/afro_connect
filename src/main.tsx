import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Starting application...');

// Check if required environment variables are present
console.log('Environment check:', {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Present' : '❌ Missing',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing',
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('❌ Root element not found');
    throw new Error('Root element not found');
  } else {
    console.log('✅ Root element found, creating React root...');
    const root = createRoot(rootElement);
    console.log('✅ React root created, rendering App...');
    root.render(<App />);
    console.log('✅ App rendering initiated');
  }
} catch (error) {
  console.error('❌ Error rendering app:', error);
  
  // Display error on page for debugging
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: red;">Application Error</h1>
        <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
        <p><strong>Stack:</strong></p>
        <pre style="background: #f5f5f5; padding: 10px; white-space: pre-wrap;">${error instanceof Error ? error.stack : 'No stack trace'}</pre>
        <p>Check the browser console for more details.</p>
      </div>
    `;
  }
}
