import { createRoot } from 'react-dom/client'
import './index.css'

const TestApp = () => {
  return (
    <div className="p-8 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>If you can see this, the basic React rendering is working.</p>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<TestApp />);
