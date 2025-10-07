import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  price: number;
  location: {
    address: string;
    area: string;
    city: string;
    neighborhood: string;
    coordinates: number[];
  };
  bedrooms: number;
  bathrooms: number;
  size: number;
  features: string[];
  amenities: string[];
  images: string[];
  status: 'active' | 'inactive' | 'pending';
  furnished: boolean;
  parking: boolean;
  petFriendly: boolean;
}

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [property, setProperty] = useState<Property | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const propertyTypes = [
    'apartment', 'house', 'studio', 'townhouse', 'villa', 
    'penthouse', 'duplex', 'office', 'shop', 'warehouse'
  ];

  const availableFeatures = [
    'furnished', 'parking', 'garden', 'balcony', 'terrace',
    'swimming_pool', 'gym', 'security', 'elevator', 'air_conditioning',
    'heating', 'wifi', 'laundry', 'pet_friendly', 'solar_power'
  ];

  const availableAmenities = [
    'kitchen', 'living_room', 'dining_room', 'master_bedroom',
    'guest_room', 'study_room', 'storage_room', 'servant_quarters',
    'garage', 'basement', 'attic', 'pantry', 'walk_in_closet'
  ];

  const kenyanCities = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega'
  ];

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        alert('Failed to fetch property details');
        navigate('/agent-dashboard');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      alert('Failed to fetch property details');
      navigate('/agent-dashboard');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!property) return;
    
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProperty(prev => prev ? {
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Property] as any),
          [child]: type === 'number' ? parseFloat(value) : value
        }
      } : null);
    } else {
      setProperty(prev => prev ? {
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      } : null);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!property) return;
    
    const { name, checked } = e.target;
    setProperty(prev => prev ? {
      ...prev,
      [name]: checked
    } : null);
  };

  const handleFeatureToggle = (feature: string, type: 'features' | 'amenities') => {
    if (!property) return;
    
    setProperty(prev => prev ? {
      ...prev,
      [type]: prev[type].includes(feature)
        ? prev[type].filter(f => f !== feature)
        : [...prev[type], feature]
    } : null);
  };

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = (property?.images.length || 0) - removedImages.length + newImages.length + files.length;
    
    if (totalImages > 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
  };

  const removeExistingImage = (imageUrl: string) => {
    setRemovedImages(prev => [...prev, imageUrl]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const restoreImage = (imageUrl: string) => {
    setRemovedImages(prev => prev.filter(url => url !== imageUrl));
  };

  const validateStep = (step: number): boolean => {
    if (!property) return false;
    
    switch (step) {
      case 1:
        return property.title.trim() !== '' && property.description.trim() !== '' && property.type !== '';
      case 2:
        return property.location.address.trim() !== '' && property.location.city.trim() !== '';
      case 3:
        return property.price > 0 && property.size > 0;
      case 4:
        return true; // Features are optional
      case 5:
        const remainingImages = property.images.length - removedImages.length + newImages.length;
        return remainingImages > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      alert('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!property || !validateStep(currentStep)) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add property data
      const propertyData = {
        ...property,
        removedImages
      };
      
      formData.append('propertyData', JSON.stringify(propertyData));
      
      // Add new images
      newImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Property updated successfully!');
        navigate('/agent-dashboard');
      } else {
        const error = await response.json();
        alert(`Failed to update property: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    if (!property) return null;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={property.title}
                onChange={handleInputChange}
                placeholder="e.g., Spacious 3-bedroom apartment in Westlands"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type *
              </label>
              <select
                name="type"
                value={property.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select property type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={property.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={property.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the property, its features, and what makes it special..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Location Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="location.address"
                value={property.location.address}
                onChange={handleInputChange}
                placeholder="e.g., 123 Kimathi Street"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <select
                  name="location.city"
                  value={property.location.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select city</option>
                  {kenyanCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area/District
                </label>
                <input
                  type="text"
                  name="location.area"
                  value={property.location.area}
                  onChange={handleInputChange}
                  placeholder="e.g., Westlands"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Neighborhood
              </label>
              <input
                type="text"
                name="location.neighborhood"
                value={property.location.neighborhood}
                onChange={handleInputChange}
                placeholder="e.g., Sarit Centre Area"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Property Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (KES) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={property.price}
                  onChange={handleInputChange}
                  placeholder="100000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size (sq meters) *
                </label>
                <input
                  type="number"
                  name="size"
                  value={property.size}
                  onChange={handleInputChange}
                  placeholder="120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <select
                  name="bedrooms"
                  value={property.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 0 ? '(Studio)' : num === 1 ? 'Bedroom' : 'Bedrooms'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <select
                  name="bathrooms"
                  value={property.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Property Status</h4>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={property.furnished}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Furnished</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={property.parking}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Parking Available</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="petFriendly"
                    checked={property.petFriendly}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pet Friendly</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Features & Amenities</h3>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFeatures.map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={property.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature, 'features')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {feature.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableAmenities.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={property.amenities.includes(amenity)}
                      onChange={() => handleFeatureToggle(amenity, 'amenities')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {amenity.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Property Images</h3>
            
            {/* Existing Images */}
            {property.images.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Current Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.images.map((imageUrl, index) => {
                    const isRemoved = removedImages.includes(imageUrl);
                    return (
                      <div key={index} className={`relative ${isRemoved ? 'opacity-50' : ''}`}>
                        <img
                          src={imageUrl}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {isRemoved ? (
                          <button
                            type="button"
                            onClick={() => restoreImage(imageUrl)}
                            className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-green-700"
                          >
                            ↶
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeExistingImage(imageUrl)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ×
                          </button>
                        )}
                        {index === 0 && !isRemoved && (
                          <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add New Images (Max 10 total images)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload high-quality images. Total images: {property.images.length - removedImages.length + newImages.length}/10
              </p>
            </div>

            {/* New Images Preview */}
            {newImages.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">New Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                      <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing Status
              </label>
              <select
                name="status"
                value={property.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active (Visible to public)</option>
                <option value="inactive">Inactive (Hidden from public)</option>
                <option value="pending">Pending (Under review)</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Edit Property</h1>
            <p className="text-gray-600 mt-1">Update property details and information</p>
            
            {/* Progress Steps */}
            <div className="mt-6">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((step) => (
                  <React.Fragment key={step}>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 5 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Basic Info</span>
                <span>Location</span>
                <span>Details</span>
                <span>Features</span>
                <span>Images</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating Property...' : 'Update Property'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;