import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if still loading or on auth/onboarding pages
    if (loading) return;
    if (location.pathname.startsWith('/auth/') || 
        location.pathname === '/onboarding' || 
        location.pathname === '/login' || 
        location.pathname === '/signup') return;

    // If user is authenticated but hasn't completed onboarding
    if (user && profile) {
      const hasCompletedOnboarding = profile.metadata && 
        (profile.metadata as any)?.onboarding_completed === true;
      
      if (!hasCompletedOnboarding) {
        console.log('🚀 Redirecting to onboarding - user has not completed setup');
        navigate('/onboarding', { replace: true });
        return;
      }
    }
  }, [user, profile, loading, navigate, location.pathname]);

  return <>{children}</>;
};

export default OnboardingGuard; 