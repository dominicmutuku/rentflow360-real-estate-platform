import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  location: {
    address: string;
    area: string;
    city: string;
    county: string;
    neighborhood: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  specifications: {
    bedrooms: number;
    bathrooms: number;
    size: {
      value: number;
      unit: string;
    };
  };
  amenities: string[];
  images: Array<{
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }>;
  status: 'active' | 'inactive' | 'pending' | 'draft';
  furnished: boolean;
  parking: boolean;
  petFriendly: boolean;
  listingType: 'rent' | 'sale' | 'both';
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
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
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
      setFetchLoading(true);
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('rentflow360_token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const propertyData = result.data?.property || result.data || result;
        
        // Transform backend data to match our interface
        const transformedProperty: Property = {
          _id: propertyData._id,
          title: propertyData.title,
          description: propertyData.description,
          type: propertyData.propertyType || propertyData.type,
          category: propertyData.category || 'residential',
          price: propertyData.price || { amount: 0, currency: 'KES', period: 'monthly' },
          location: {
            address: propertyData.location?.address || '',
            area: propertyData.location?.area || propertyData.location?.county || '',
            city: propertyData.location?.city || '',
            county: propertyData.location?.county || propertyData.location?.area || '',
            neighborhood: propertyData.location?.neighborhood || '',
            coordinates: propertyData.location?.coordinates || { latitude: 0, longitude: 0 }
          },
          specifications: propertyData.specifications || {
            bedrooms: 0,
            bathrooms: 0,
            size: { value: 0, unit: 'sqft' }
          },
          amenities: propertyData.amenities || [],
          images: propertyData.images || [],
          status: propertyData.status || 'pending',
          furnished: propertyData.furnished || false,
          parking: propertyData.parking || false,
          petFriendly: propertyData.petFriendly || false,
          listingType: propertyData.listingType || 'rent'
        };
        
        setProperty(transformedProperty);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch property:', errorData);
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
    
    // Handle nested properties (e.g., "location.address", "price.amount", "specifications.bedrooms")
    if (name.includes('.')) {
      const parts = name.split('.');
      
      if (parts.length === 2) {
        const [parent, child] = parts;
        setProperty(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            [parent]: {
              ...(prev[parent as keyof Property] as any),
              [child]: type === 'number' ? (value === '' ? 0 : parseFloat(value) || 0) : value
            }
          };
        });
      } else if (parts.length === 3) {
        // Handle deeply nested like "specifications.size.value"
        const [parent, child, grandchild] = parts;
        setProperty(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            [parent]: {
              ...(prev[parent as keyof Property] as any),
              [child]: {
                ...((prev[parent as keyof Property] as any)?.[child] || {}),
                [grandchild]: type === 'number' ? (value === '' ? 0 : parseFloat(value) || 0) : value
              }
            }
          };
        });
      }
    } else {
      setProperty(prev => prev ? {
        ...prev,
        [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value) || 0) : value
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

  const handleFeatureToggle = (feature: string) => {
    if (!property) return;
    
    setProperty(prev => prev ? {
      ...prev,
      amenities: prev.amenities.includes(feature)
        ? prev.amenities.filter(f => f !== feature)
        : [...prev.amenities, feature]
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

  const handleImageUrlAdd = (url: string) => {
    if (!url.trim()) return;
    
    const currentTotal = (property?.images.length || 0) - removedImages.length + newImages.length + newImageUrls.length;
    if (currentTotal >= 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(url);
      setNewImageUrls(prev => [...prev, url.trim()]);
    } catch {
      alert('Please enter a valid URL');
    }
  };

  const removeNewImageUrl = (index: number) => {
    setNewImageUrls(prev => prev.filter((_, i) => i !== index));
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
        return property.price.amount > 0 && property.specifications.size.value > 0;
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
    
    // Only allow submission on step 5 (Images step)
    if (currentStep !== 5) {
      return;
    }
    
    if (!property || !validateStep(currentStep)) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('rentflow360_token');
      
      // Keep existing images that weren't removed
      const existingImages = property.images.filter(img => !removedImages.includes(img.url));
      
      // Add new URL images
      const urlImages = newImageUrls.map((url, index) => ({
        url: url,
        caption: `Image ${existingImages.length + index + 1}`,
        isPrimary: existingImages.length === 0 && index === 0
      }));
      
      // Combine all images
      const allImages = [...existingImages, ...urlImages];
      
      // Transform nested structure to flat structure for backend validation
      const updateData = {
        title: property.title,
        description: property.description,
        type: property.type,
        status: property.status,
        price: property.price.amount, // Flatten price
        location: {
          address: property.location.address,
          city: property.location.city,
          county: property.location.county,
          neighborhood: property.location.neighborhood,
          coordinates: property.location.coordinates
        },
        bedrooms: property.specifications.bedrooms, // Flatten specifications
        bathrooms: property.specifications.bathrooms,
        size: property.specifications.size.value,
        amenities: property.amenities,
        images: allImages, // Include updated images array
        furnished: property.furnished,
        parking: property.parking,
        petFriendly: property.petFriendly,
        listingType: property.listingType
      };

      console.log('Updating property with data:', updateData);

      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
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
                  name="price.amount"
                  value={property.price.amount}
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
                  name="specifications.size.value"
                  value={property.specifications.size.value}
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
                  name="specifications.bedrooms"
                  value={property.specifications.bedrooms}
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
                  name="specifications.bathrooms"
                  value={property.specifications.bathrooms}
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
                      checked={property.amenities.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {feature.replace(/_/g, ' ')}
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
                      onChange={() => handleFeatureToggle(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {amenity.replace(/_/g, ' ')}
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
                  {property.images.map((image, index) => {
                    const isRemoved = removedImages.includes(image.url);
                    return (
                      <div key={index} className={`relative ${isRemoved ? 'opacity-50' : ''}`}>
                        <img
                          src={image.url}
                          alt={image.caption || `Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {isRemoved ? (
                          <button
                            type="button"
                            onClick={() => restoreImage(image.url)}
                            className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-green-700"
                          >
                            ↶
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image.url)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ×
                          </button>
                        )}
                        {(image.isPrimary || index === 0) && !isRemoved && (
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
                Upload high-quality images. Total images: {property.images.length - removedImages.length + newImages.length + newImageUrls.length}/10
              </p>
            </div>

            {/* Add Images by URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Add Image by URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="editImageUrlInput"
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
                    const input = document.getElementById('editImageUrlInput') as HTMLInputElement;
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

            {/* New Images Preview */}
            {newImages.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">New Uploaded Images</h4>
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

            {/* New URL Images Preview */}
            {newImageUrls.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">New Images from URLs</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImageUrls.map((url, index) => (
                    <div key={`url-${index}`} className="relative">
                      <img
                        src={url}
                        alt={`New URL ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImageUrl(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                      <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        New URL
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