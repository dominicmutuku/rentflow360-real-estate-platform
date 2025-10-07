// Homepage component for Rentflow360
// Main landing page with hero section, search, and trending properties

import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import SearchSection from '../components/sections/SearchSection';
import TrendingProperties from '../components/sections/TrendingProperties';
import FeaturesSection from '../components/sections/FeaturesSection';

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Search Section */}
      <SearchSection />
      
      {/* Trending Properties */}
      <TrendingProperties />
      
      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

export default Homepage;