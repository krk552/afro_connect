import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Chrome, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Attempting login for:', email);
    const { error } = await signIn(email, password);

    setIsLoading(false);

    if (error) {
      console.error('Login page error:', error.message);
      toast.error(error.message || "Invalid login credentials. Please try again.");
    } else {
      console.log('Login page: sign in successful, navigating...');
      toast.success("Welcome back! You've successfully signed in.");
      navigate("/");
    }
  };

  return (
    <Card className="p-8 w-full rounded-xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-afro-orange to-afro-yellow rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl font-bold text-white">AC</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-afro-orange to-afro-yellow bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground mt-2">Sign in to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 pl-10 border-2 focus:border-afro-orange transition-colors"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Link to="/forgot-password" className="text-sm text-afro-orange hover:text-afro-yellow transition-colors hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 pl-10 pr-10 border-2 focus:border-afro-orange transition-colors"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-afro-orange to-afro-yellow hover:from-afro-orange/90 hover:to-afro-yellow/90 text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02]" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-muted-foreground font-medium">or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 border-2 hover:border-afro-orange/50 transition-colors">
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="h-12 border-2 hover:border-afro-orange/50 transition-colors">
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-afro-orange hover:text-afro-yellow transition-colors font-semibold hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>

      {/* Business Owner CTA */}
      <div className="mt-6 p-4 bg-gradient-to-r from-afro-green/10 to-afro-blue/10 rounded-lg border border-afro-green/20">
        <p className="text-sm text-center text-muted-foreground">
          Business owner?{" "}
          <Link to="/business/register" className="text-afro-green hover:text-afro-blue transition-colors font-semibold hover:underline">
            List your business
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default LoginPage;
