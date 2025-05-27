import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Chrome, Facebook, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { signUp, resendConfirmation } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service and Privacy Policy to continue.",
        variant: "destructive",
      });
      return;
    }

    // Validate password strength
    const passwordStrength = getPasswordStrength(formData.password);
    if (passwordStrength < 3) {
      toast({
        title: "Password Too Weak",
        description: "Please choose a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'customer'
      });

      if (result.error) {
        toast({
          title: "Signup Failed",
          description: result.error.message || "An error occurred during signup. Please try again.",
          variant: "destructive",
        });
      } else if (result.needsEmailConfirmation) {
        setEmailSent(true);
        toast({
          title: "Check Your Email! 📧",
          description: result.message || "We've sent you a confirmation link. Please check your email to complete your registration.",
        });
      } else {
        toast({
          title: "Welcome to AfroBiz Connect! 🎉",
          description: result.message || "Your account has been created successfully!",
        });
        navigate("/");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  // Show email confirmation message if email was sent
  if (emailSent) {
    return (
      <Card className="p-8 w-full rounded-xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Check Your Email!
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've sent a confirmation link to <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Click the link in your email to complete your registration. 
            The link will expire in 24 hours.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={async () => {
                setIsLoading(true);
                const { error } = await resendConfirmation(formData.email);
                if (error) {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                } else {
                  toast({
                    title: "Email Resent",
                    description: "We've sent another confirmation email to your inbox.",
                  });
                }
                setIsLoading(false);
              }}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? "Sending..." : "Resend Confirmation Email"}
            </Button>
            
            <Button 
              onClick={() => {
                setEmailSent(false);
                setFormData({ firstName: "", lastName: "", email: "", password: "" });
              }}
              variant="ghost"
              className="w-full"
            >
              Try Different Email
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-gray-500">Already confirmed? </span>
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 w-full rounded-xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-afro-green to-afro-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-afro-green to-afro-blue bg-clip-text text-transparent">
          Join Afro-Connect
        </h1>
        <p className="text-muted-foreground mt-2">Create your account and discover amazing businesses</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="h-12 pl-10 border-2 focus:border-afro-green transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="h-12 pl-10 border-2 focus:border-afro-green transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-12 pl-10 border-2 focus:border-afro-green transition-colors"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="h-12 pl-10 pr-10 border-2 focus:border-afro-green transition-colors"
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
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Enter a password"}
              </p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        <div className="flex items-start space-x-3 pt-2">
          <Checkbox 
            id="terms" 
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            className="mt-1" 
          />
          <Label htmlFor="terms" className="text-sm leading-normal">
            I agree to the{" "}
            <Link to="/terms" className="text-afro-green hover:text-afro-blue transition-colors hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-afro-green hover:text-afro-blue transition-colors hover:underline font-medium">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-afro-green to-afro-blue hover:from-afro-green/90 hover:to-afro-blue/90 text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-[1.02]" 
          disabled={isLoading || !agreeToTerms}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Creating Account...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Create Account
            </div>
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
          <Button variant="outline" className="h-12 border-2 hover:border-afro-green/50 transition-colors">
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="h-12 border-2 hover:border-afro-green/50 transition-colors">
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-afro-green hover:text-afro-blue transition-colors font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Business Owner CTA */}
      <div className="mt-6 p-4 bg-gradient-to-r from-afro-orange/10 to-afro-yellow/10 rounded-lg border border-afro-orange/20">
        <p className="text-sm text-center text-muted-foreground">
          Want to list your business?{" "}
          <Link to="/business/register" className="text-afro-orange hover:text-afro-yellow transition-colors font-semibold hover:underline">
            Register as a business owner
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default SignupPage;
