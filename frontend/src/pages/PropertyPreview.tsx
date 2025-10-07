// Property Preview Page (Page 1 of 3-page system)
// Shows property photo, price, location, and size only

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

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
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  specifications: {
    bedrooms: number;
    bathrooms: number;
    size: {
      unit: string;
    };
  };
  images: {
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }[];
  amenities: string[];
  status: string;
  agent: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  analytics: {
    views: number;
  };
  createdAt: string;
}

const PropertyPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/properties/${id}`);
      const data = await response.json();

      if (response.ok) {
        setProperty(data.data.property);
      } else {
        setError(data.message || 'Property not found');
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };



  const formatPrice = (price: { amount: number; currency: string; period: string }) => {
    const formatted = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price.amount);
    return formatted;
  };

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 w-64 mb-4"></div>
            <div className="bg-gray-300 h-96 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-300 w-full mb-2"></div>
                <div className="h-4 bg-gray-300 w-3/4 mb-4"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="h-48 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Property not found</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              to="/search"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm breadcrumbs mb-6">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="text-primary-600 hover:text-primary-700">Home</Link></li>
            <li><span className="text-gray-400">/</span></li>
            <li><Link to="/search" className="text-primary-600 hover:text-primary-700">Search</Link></li>
            <li><span className="text-gray-400">/</span></li>
            <li><span className="text-gray-600">Property Preview</span></li>
          </ol>
        </nav>

        {/* Property Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.location.neighborhood}, {property.location.city}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-semibold uppercase">
                  {property.propertyType}
                </span>
                <span>{property.analytics.views} views</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                {formatPrice(property.price)}
              </div>
              <div className="text-gray-600">per month</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-4" style={{ height: '500px' }}>
              <img
                src={property.images[currentImageIndex]?.url || '/api/placeholder/800/500'}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Image Navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              {/* View All Photos Button */}
              <Link
                to={`/property/${property._id}/photos`}
                className="absolute bottom-3 left-3 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View All Photos ({property.images.length})
              </Link>
            </div>

            {/* Thumbnail Images */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-24 bg-gray-200 rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-primary-600' : ''
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    {index === 3 && property.images.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold">
                        +{property.images.length - 4}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Property Details */}
          <div className="space-y-6">
            {/* Property Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bedrooms</span>
                  <span className="font-semibold">{property.specifications.bedrooms}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bathrooms</span>
                  <span className="font-semibold">{property.specifications.bathrooms}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Size</span>
                  <span className="font-semibold">N/A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Type</span>
                  <span className="font-semibold capitalize">{property.propertyType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold capitalize ${
                    property.status === 'available' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>{property.location.neighborhood}, {property.location.city}</p>
                  <p className="text-sm">Interactive map coming soon</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-3">
                <Link
                  to={`/property/${property._id}/details`}
                  className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  View Full Details
                </Link>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="block w-full bg-white border-2 border-primary-600 text-primary-600 text-center py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Contact Agent
                </button>
                <button className="block w-full bg-gray-100 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Save to Favorites
                </button>
              </div>
            </div>

            {/* Agent Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listed by</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">
                    {property.agent.firstName[0]}{property.agent.lastName[0]}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {property.agent.firstName} {property.agent.lastName}
                  </div>
                  <div className="text-sm text-gray-600">Licensed Agent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Agent Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Contact Agent</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Agent Info */}
              <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold text-lg">
                    {property.agent.firstName[0]}{property.agent.lastName[0]}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {property.agent.firstName} {property.agent.lastName}
                  </div>
                  <div className="text-sm text-gray-600">Licensed Agent</div>
                  <div className="text-sm text-gray-600">{property.agent.email}</div>
                  {property.agent.phone && (
                    <div className="text-sm text-gray-600">{property.agent.phone}</div>
                  )}
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Choose how you'd like to contact {property.agent.firstName}:
                </div>
                
                {property.agent.phone && (
                  <>
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                      onClick={() => setShowContactModal(false)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </a>
                    
                    <a
                      href={`https://wa.me/${property.agent.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center"
                      onClick={() => setShowContactModal(false)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c3.181 0 5.767 2.586 5.768 5.766-.001 1.298-.38 2.27-1.019 3.287l-.582 1.14.582-.003c.027.002.055-.005.083-.005 2.174 0 3.996 1.822 3.997 3.996.001 2.174-1.822 3.996-3.996 3.997H6.134c-2.174 0-3.996-1.822-3.997-3.996-.001-2.174 1.822-3.996 3.996-3.997H8.67l-.582-1.14c-.639-1.018-1.018-1.989-1.019-3.287C7.264 8.758 9.85 6.172 12.031 6.172z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </>
                )}
                
                <a
                  href={`mailto:${property.agent.email}?subject=Inquiry about ${property.title}&body=Hi ${property.agent.firstName},%0D%0A%0D%0AI'm interested in the property "${property.title}" and would like more information.%0D%0A%0D%0AThank you!`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  onClick={() => setShowContactModal(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
              </div>

              {/* Safety Note */}
              <div className="mt-6 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Safety Tip:</strong> Always verify agent credentials and meet in public places or at the property.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPreview;