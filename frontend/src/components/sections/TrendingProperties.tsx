// Trending Properties section for the homepage
// Displays popular and featured properties

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  location: {
    city: string;
    neighborhood: string;
  };
  specifications: {
    bedrooms: number;
    bathrooms: number;
  };
  images: {
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }[];
  amenities: string[];
  agent: {
    firstName: string;
    lastName: string;
  };
  analytics: {
    views: number;
  };
  createdAt: string;
}

const TrendingProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingProperties = React.useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/properties?limit=6&sort=-views,-createdAt`);
      const data = await response.json();
      
      if (response.ok) {
        setProperties(data.data.properties || []);
      } else {
        setError(data.message || 'Failed to fetch properties');
      }
    } catch (err) {
      console.error('Error fetching trending properties:', err);
      setError('Failed to load trending properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingProperties();
  }, [fetchTrendingProperties]);



  const formatPrice = (price: { amount: number; currency: string; period: string }): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price.amount);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Properties</h2>
            <p className="text-xl text-gray-600">Discover the most popular properties this month</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && properties.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Properties</h2>
          <p className="text-red-600 mb-8">{error}</p>
          <button 
            onClick={fetchTrendingProperties}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Trending Properties
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most popular properties this month. From luxury apartments to affordable family homes.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property) => (
            <div 
              key={property._id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Property Image */}
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={property.images?.[0]?.url || '/api/placeholder/400/300'} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/400/300';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {property.propertyType}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {formatPrice(property.price)}/month
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {property.description}
                </p>

                {/* Location */}
                <div className="flex items-center text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{property.location.neighborhood}, {property.location.city}</span>
                </div>

                {/* Property Stats */}
                <div className="flex items-center justify-between text-gray-500 mb-6">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                    </svg>
                    <span className="text-sm">{property.specifications.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6" />
                    </svg>
                    <span className="text-sm">{property.specifications.bathrooms} bath</span>
                  </div>
                </div>

                {/* View Details Button */}
                <Link 
                  to={`/property/${property._id}`}
                  className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link 
            to="/properties"
            className="inline-flex items-center bg-transparent border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
          >
            View All Properties
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingProperties;