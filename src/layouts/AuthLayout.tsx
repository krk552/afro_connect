
import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="p-4 flex items-center">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to home</span>
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-display font-bold text-primary">
                AfroBiz<span className="text-accent">Connect</span>
              </span>
            </Link>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
