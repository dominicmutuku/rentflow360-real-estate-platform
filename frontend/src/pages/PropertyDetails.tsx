// Property Details Page (Page 2 of 3-page system)
// Shows full property details, description, amenities, contact info, and safety tips

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import PropertyInquiry from '../components/PropertyInquiry';

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
  updatedAt: string;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price.amount);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', contactForm);
    alert('Your inquiry has been sent to the agent!');
    setShowContactForm(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const safetyTips = [
    {
      icon: '🔍',
      title: 'Verify Property',
      tip: 'Always visit the property in person and verify ownership documents before making any payments.'
    },
    {
      icon: '💰',
      title: 'Secure Payments',
      tip: 'Never send money before viewing the property. Use secure payment methods and get receipts.'
    },
    {
      icon: '📄',
      title: 'Read Contracts',
      tip: 'Carefully read all rental agreements and contracts. Seek legal advice if needed.'
    },
    {
      icon: '🔒',
      title: 'Report Suspicious Activity',
      tip: 'Report any suspicious listings or requests for upfront payments to our support team.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 w-64 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-gray-300 rounded-lg"></div>
                <div className="h-32 bg-gray-300 rounded-lg"></div>
                <div className="h-64 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-300 rounded-lg"></div>
                <div className="h-32 bg-gray-300 rounded-lg"></div>
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
            <li><Link to={`/property/${property._id}`} className="text-primary-600 hover:text-primary-700">Preview</Link></li>
            <li><span className="text-gray-400">/</span></li>
            <li><span className="text-gray-600">Details</span></li>
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
            <span className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold">
              Details
            </span>
            <Link
              to={`/property/${property._id}/photos`}
              className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              Photos ({property.images.length})
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images Preview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {property.images.slice(0, 3).map((image, index) => (
                  <div key={index} className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>
                ))}
              </div>
              <Link
                to={`/property/${property._id}/photos`}
                className="block text-center bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                View All {property.images.length} Photos
              </Link>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-gray max-w-none">
                {property.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Building Features</h3>
                  <ul className="space-y-2">
                    {property.amenities.slice(0, 5).map((feature: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Unit Amenities</h3>
                  <ul className="space-y-2">
                    {property.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.083 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h2 className="text-xl font-semibold text-yellow-800">Safety Tips</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safetyTips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{tip.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                        <p className="text-sm text-gray-700">{tip.tip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Agent Info & Contact */}
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
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold">{property.analytics.views}</span>
                </div>
              </div>
            </div>

            {/* Agent Contact Component */}
            <PropertyInquiry
              propertyId={property._id}
              agentInfo={{
                firstName: property.agent.firstName,
                lastName: property.agent.lastName,
                email: property.agent.email,
                phone: property.agent.phone
              }}
              propertyTitle={property.title}
            />

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <FavoriteButton
                    propertyId={property._id}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  />
                </div>
                <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Share Property
                </button>
                <button className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors">
                  Report Listing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Agent</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="I'm interested in this property..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;