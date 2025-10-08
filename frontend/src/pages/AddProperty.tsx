import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PropertyForm {
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
  images: File[];
  imageUrls: string[]; // Add support for image URLs
  status: 'active' | 'inactive' | 'pending';
  furnished: boolean;
  parking: boolean;
  petFriendly: boolean;
}

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyForm>({
    title: '',
    description: '',
    type: '',
    category: 'residential',
    price: 0,
    location: {
      address: '',
      area: '',
      city: '',
      neighborhood: '',
      coordinates: [0, 0]
    },
    bedrooms: 1,
    bathrooms: 1,
    size: 0,
    features: [],
    amenities: [],
    images: [],
    imageUrls: [], // Initialize image URLs array
    status: 'active',
    furnished: false,
    parking: false,
    petFriendly: false
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof PropertyForm] as any),
          [child]: type === 'number' ? (value === '' ? 0 : parseFloat(value) || 0) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value) || 0) : value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFeatureToggle = (feature: string, type: 'features' | 'amenities') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(feature)
        ? prev[type].filter(f => f !== feature)
        : [...prev[type], feature]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentTotal = formData.images.length + formData.imageUrls.length;
    const remainingSlots = 10 - currentTotal;
    
    if (remainingSlots <= 0) {
      alert('Maximum 10 images allowed');
      return;
    }
    
    const filesToAdd = files.slice(0, remainingSlots);
    
    // Convert files to base64 and add to imageUrls
    for (const file of filesToAdd) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, base64String]
        }));
      };
      reader.readAsDataURL(file);
    }
    
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  const handleImageUrlAdd = (url: string) => {
    if (!url.trim()) return;
    
    const currentTotal = formData.images.length + formData.imageUrls.length;
    if (currentTotal >= 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(url);
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, url.trim()]
      }));
    } catch {
      alert('Please enter a valid URL');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title.trim().length >= 5 && 
               formData.description.trim().length >= 20 && 
               formData.type !== '';
      case 2:
        return formData.location.address.trim() !== '' && 
               formData.location.city.trim() !== '' && 
               formData.location.area.trim() !== '';
      case 3:
        return formData.price > 0 && formData.size > 0;
      case 4:
        // Features & Amenities step - no required fields, just allow continuation
        return true;
      case 5:
        // Images step - allow without images but warn
        return true;
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
    e.stopPropagation();
    
    console.log('========================================');
    console.log('FORM SUBMIT HANDLER CALLED');
    console.log('Current Step:', currentStep);
    console.log('========================================');
    
    // ABSOLUTE BLOCK: Do not proceed unless on step 5
    if (currentStep !== 5) {
      console.log('🛑 BLOCKED: Not on step 5');
      alert('Please complete all steps before submitting. You are on step ' + currentStep);
      return false;
    }
    
    console.log('✅ ALLOWED: Proceeding with submission on step 5');
    
    // Validate all steps before submission
    for (let step = 1; step <= 5; step++) {
      if (!validateStep(step)) {
        alert(`Please complete all required fields in step ${step}`);
        setCurrentStep(step);
        return;
      }
    }

    // NO WARNING - just proceed with or without images
    setLoading(true);
    
    try {
      // Combine features and amenities into one array for backend
      const combinedAmenities = [...formData.features, ...formData.amenities];
      
      // Convert imageUrls to image objects format
      const urlImages = formData.imageUrls.map((url, index) => ({
        url: url,
        caption: `Image ${index + 1}`,
        isPrimary: index === 0
      }));
      
      console.log('Total URL images:', urlImages.length);
      console.log('URL images:', urlImages);
      
      // Prepare property data to match backend validation expectations
      const propertyData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: formData.price,
        location: {
          address: formData.location.address,
          city: formData.location.city,
          county: formData.location.area, // Map 'area' to 'county' as backend expects
          neighborhood: formData.location.neighborhood,
          coordinates: formData.location.coordinates
        },
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        size: formData.size,
        amenities: combinedAmenities, // Send combined features + amenities as amenities
        status: formData.status,
        furnished: formData.furnished,
        parking: formData.parking,
        petFriendly: formData.petFriendly,
        listingType: 'rent',
        images: urlImages // Include URL images
      };

      console.log('Sending property data:', propertyData);

      const response = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('rentflow360_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
      });

      if (response.ok) {
        await response.json();
        alert('Property added successfully!');
        navigate('/agent-dashboard');
      } else {
        const error = await response.json();
        alert(`Failed to add property: ${error.message}`);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
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
                value={formData.title}
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
                value={formData.type}
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
                value={formData.category}
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
                value={formData.description}
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
                value={formData.location.address}
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
                  value={formData.location.city}
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
                  Area/District *
                </label>
                <input
                  type="text"
                  name="location.area"
                  value={formData.location.area}
                  onChange={handleInputChange}
                  placeholder="e.g., Westlands"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
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
                value={formData.location.neighborhood}
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
                  value={formData.price}
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
                  value={formData.size}
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
                  value={formData.bedrooms}
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
                  value={formData.bathrooms}
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
                    checked={formData.furnished}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Furnished</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={formData.parking}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Parking Available</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="petFriendly"
                    checked={formData.petFriendly}
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
                      checked={formData.features.includes(feature)}
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
                      checked={formData.amenities.includes(amenity)}
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
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images * (Max 10 images total)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload high-quality images. First image will be the main photo.
              </p>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Add Image by URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="imageUrlInput"
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      handleImageUrlAdd(input.value);
                      input.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('imageUrlInput') as HTMLInputElement;
                    handleImageUrlAdd(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add URL
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Paste a direct link to an image (jpg, png, etc.)
              </p>
            </div>

            {/* Display All Images */}
            {formData.imageUrls.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Added Images ({formData.imageUrls.length}/10)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.imageUrls.map((url, index) => (
                    <div key={`image-${index}`} className="relative">
                      <img
                        src={url}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Main
                        </span>
                      )}
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
                value={formData.status}
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Add New Property</h1>
            
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Next button clicked on step:', currentStep);
                    nextStep();
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  onClick={() => console.log('Submit button clicked on step:', currentStep)}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Property...' : 'Add Property'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;