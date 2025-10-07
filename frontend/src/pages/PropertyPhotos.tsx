// Property Photos Page (Page 3 of 3-page system)
// Full-page zoomed photo view with watermark

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Property {
  _id: string;
  title: string;
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
  images: {
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }[];
  agent: {
    firstName: string;
    lastName: string;
  };
}

const PropertyPhotos: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'Escape') {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 w-64 mb-4"></div>
            <div className="h-96 bg-gray-300 rounded-lg mb-4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
              ))}
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
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm breadcrumbs mb-6">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="text-primary-600 hover:text-primary-700">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li><Link to="/search" className="text-primary-600 hover:text-primary-700">Search</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li><Link to={`/property/${property._id}`} className="text-primary-600 hover:text-primary-700">Preview</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li><span className="text-gray-600">Photos</span></li>
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
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  {formatPrice(property.price)}
                </div>
                <div className="text-gray-600">per month</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-4 border-t pt-4">
              <Link
                to={`/property/${property._id}`}
                className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                Preview
              </Link>
              <Link
                to={`/property/${property._id}/details`}
                className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                Details
              </Link>
              <span className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold">
                Photos ({property.images.length})
              </span>
            </div>
          </div>

          {/* Main Photo Display */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="relative">
              {/* Main Image */}
              <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <img
                  src={property.images[currentImageIndex]?.url || '/api/placeholder/1200/600'}
                  alt={`${property.title} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsFullscreen(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {/* Watermark */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg">
                  <div className="text-sm font-semibold">Rentflow360.com</div>
                  <div className="text-xs opacity-75">Licensed by {property.agent.firstName} {property.agent.lastName}</div>
                </div>

                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 left-4 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  title="View Fullscreen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Photos ({property.images.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-24 bg-gray-200 rounded-lg overflow-hidden hover:opacity-75 transition-opacity ${
                    currentImageIndex === index ? 'ring-2 ring-primary-600' : ''
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.caption || `Property photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                  
                  {/* Photo Number Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>

                  {/* Current Photo Indicator */}
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-primary-600 bg-opacity-20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              to={`/property/${property._id}/details`}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              View Property Details
            </Link>
            <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Download Photos
            </button>
            <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Share Photos
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full z-10">
            {currentImageIndex + 1} / {property.images.length}
          </div>

          {/* Main Fullscreen Image */}
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img
              src={property.images[currentImageIndex]?.url}
              alt={`${property.title} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
              }}
            />

            {/* Watermark in Fullscreen */}
            <div className="absolute bottom-8 right-8 bg-black bg-opacity-60 text-white px-6 py-3 rounded-lg">
              <div className="text-lg font-semibold">Rentflow360.com</div>
              <div className="text-sm opacity-75">Licensed by {property.agent.firstName} {property.agent.lastName}</div>
            </div>

            {/* Navigation Arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white p-4 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white p-4 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-75 text-center">
            Use arrow keys to navigate • Press ESC to exit fullscreen
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyPhotos;