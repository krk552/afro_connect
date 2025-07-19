import React, { Suspense, useMemo } from 'react';
import { BusinessCardSkeleton } from '@/components/LoadingStates';

// Lazy load heavy components to improve initial page load
const Hero = React.lazy(() => import('@/components/Hero'));
const FeaturedBusinesses = React.lazy(() => import('@/components/FeaturedBusinesses'));
const CategorySection = React.lazy(() => import('@/components/CategorySection'));
const HowItWorks = React.lazy(() => import('@/components/HowItWorks'));
const Testimonials = React.lazy(() => import('@/components/Testimonials'));

// Thumbtack-inspired simple loading component
const SimpleLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Skeleton for featured businesses
const FeaturedBusinessesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <BusinessCardSkeleton key={i} />
    ))}
  </div>
);

const Index = () => {
  // Memoize the page title for SEO
  const pageTitle = useMemo(() => "Makna - Connect with Local African Businesses", []);
  const pageDescription = useMemo(() => 
    "Discover and book services from trusted local African businesses. From beauty salons to restaurants, find the best services in your area."
  , []);

  return (
    <>
      {/* SEO Optimization */}
      <div className="hidden">
        <h1>{pageTitle}</h1>
        <meta name="description" content={pageDescription} />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
        {/* Hero Section - Load immediately for critical above-the-fold content */}
        <Suspense fallback={
          <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-orange-600 to-yellow-500">
            <div className="text-center text-white space-y-6 px-4">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h1 className="text-4xl md:text-6xl font-bold">Makna</h1>
              <p className="text-xl opacity-90">Loading your local business directory...</p>
            </div>
          </div>
        }>
          <Hero />
        </Suspense>

        {/* Categories Section - High priority */}
        <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="container mx-auto px-4">
            <Suspense fallback={
              <div className="text-center">
                <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8 animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-md animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            }>
              <CategorySection />
            </Suspense>
          </div>
        </section>

        {/* Featured Businesses - Can be lazy loaded */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Businesses
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover top-rated local businesses trusted by our community
              </p>
            </div>
            <Suspense fallback={<FeaturedBusinessesSkeleton />}>
              <FeaturedBusinesses />
            </Suspense>
          </div>
        </section>

        {/* How It Works - Lower priority, can load later */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <Suspense fallback={<SimpleLoader />}>
              <HowItWorks />
            </Suspense>
          </div>
        </section>

        {/* Testimonials - Lowest priority */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Suspense fallback={<SimpleLoader />}>
              <Testimonials />
            </Suspense>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
