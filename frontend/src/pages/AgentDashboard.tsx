import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Property {
  _id: string;
  title: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  location: {
    city: string;
    area: string;
  };
  images: string[];
  type: string;
  bedrooms: number;
  bathrooms: number;
  status: 'active' | 'inactive' | 'pending' | 'sold' | 'rented';
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface Inquiry {
  _id: string;
  inquirerName: string;
  inquirerEmail: string;
  inquirerPhone: string;
  message: string;
  type: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  property: {
    _id: string;
    title: string;
    price: {
      amount: number;
      currency: string;
      period: string;
    };
  };
  createdAt: string;
  conversations: Array<{
    sender: string;
    message: string;
    timestamp: string;
    isRead: boolean;
  }>;
}

interface AgentStats {
  totalProperties: number;
  activeProperties: number;
  totalInquiries: number;
  pendingInquiries: number;
  totalViews: number;
  avgResponseTime: number;
}

const AgentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<AgentStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    totalViews: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'agent') {
      fetchAgentData();
    }
  }, [user]);

  // Update stats when properties change
  useEffect(() => {
    if (properties.length > 0) {
      const totalViews = properties.reduce((sum, prop) => sum + (prop.views || 0), 0);
      setStats(prev => ({
        ...prev,
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.status === 'active').length,
        totalViews
      }));
    }
  }, [properties]);

  const fetchAgentData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rentflow360_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch agent data in parallel
      const [propertiesRes, inquiriesRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/properties/agent/my-properties', { headers }),
        fetch('http://localhost:5000/api/inquiries', { headers }),
        fetch('http://localhost:5000/api/inquiries/stats', { headers })
      ]);

      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json();
        setProperties(propertiesData.data?.properties || []);
      } else {
        console.error('Failed to fetch properties:', await propertiesRes.text());
      }

      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        setInquiries(inquiriesData.data?.inquiries || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const statistics = statsData.data?.statistics || {};
        
        setStats(prev => ({
          ...prev,
          totalInquiries: statistics.total || 0,
          pendingInquiries: statistics.pending || 0,
          avgResponseTime: statistics.avgResponseTime || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyStatusChange = async (propertyId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('rentflow360_token');
      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state
        setProperties(prev => 
          prev.map(prop => 
            prop._id === propertyId ? { ...prop, status: newStatus as Property['status'] } : prop
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          activeProperties: properties.filter(p => 
            p._id === propertyId ? newStatus === 'active' : p.status === 'active'
          ).length
        }));
      }
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('rentflow360_token');
      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove property from local state
        setProperties(prev => prev.filter(prop => prop._id !== propertyId));
        alert('Property deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to delete property: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    }
  };

  const formatPrice = (price: { amount: number; currency: string; period: string } | number) => {
    // Handle both old format (number) and new format (object)
    const amount = typeof price === 'number' ? price : price.amount;
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'rented': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInquiryStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (user?.role !== 'agent') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">This dashboard is only available for agents.</p>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Rentflow360
              </Link>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Agent Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.firstName}!
              </span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">Real Estate Agent</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'properties' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🏠 My Properties ({stats.totalProperties})
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'inquiries' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  💬 Inquiries ({stats.pendingInquiries})
                  {stats.pendingInquiries > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-1">
                      {stats.pendingInquiries}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/add-property')}
                  className="w-full text-left px-4 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                >
                  ➕ Add Property
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'analytics' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📈 Analytics
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Agent Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Properties</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalProperties}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Properties</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.activeProperties}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalInquiries}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Views</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Properties */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-800">Recent Properties</h2>
                    </div>
                    <div className="p-6">
                      {properties.slice(0, 5).map(property => (
                        <div key={property._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-lg overflow-hidden">
                              {property.images.length > 0 ? (
                                <img
                                  src={property.images[0]}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  🏠
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <h3 className="font-medium text-gray-800 text-sm">{property.title}</h3>
                              <p className="text-xs text-gray-600">
                                {property.location.area}, {property.location.city}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                              {property.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{property.views} views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Inquiries */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-800">Recent Inquiries</h2>
                    </div>
                    <div className="p-6">
                      {inquiries.slice(0, 5).map(inquiry => (
                        <div key={inquiry._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                          <div>
                            <h3 className="font-medium text-gray-800 text-sm">{inquiry.inquirerName}</h3>
                            <p className="text-xs text-gray-600">{inquiry.property.title}</p>
                            <p className="text-xs text-gray-500">{formatDate(inquiry.createdAt)}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInquiryStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-800">My Properties</h1>
                  <button
                    onClick={() => setActiveTab('add-property')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add New Property
                  </button>
                </div>

                {properties.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0h-9m0 0h5M9 7h6m-6 4h6m-6 4h6" />
                    </svg>
                    <p className="text-xl text-gray-600 mb-2">No properties yet</p>
                    <p className="text-gray-500 mb-6">Add your first property to get started</p>
                    <button
                      onClick={() => setActiveTab('add-property')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add Property
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Property
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Views
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {properties.map(property => (
                            <tr key={property._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-lg object-cover"
                                      src={property.images[0] || '/placeholder-property.jpg'}
                                      alt={property.title}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {property.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {property.location.area}, {property.location.city}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatPrice(property.price)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={property.status}
                                  onChange={(e) => handlePropertyStatusChange(property._id, e.target.value)}
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}
                                >
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                  <option value="pending">Pending</option>
                                  <option value="sold">Sold</option>
                                  <option value="rented">Rented</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {property.views}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(property.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  to={`/property/${property._id}`}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  View
                                </Link>
                                <Link
                                  to={`/edit-property/${property._id}`}
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  Edit
                                </Link>
                                <button 
                                  onClick={() => handleDeleteProperty(property._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inquiries Tab */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Property Inquiries</h1>
                
                {inquiries.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-xl text-gray-600 mb-2">No inquiries yet</p>
                    <p className="text-gray-500">Customer inquiries will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map(inquiry => (
                      <div key={inquiry._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {inquiry.inquirerName}
                            </h3>
                            <p className="text-gray-600">{inquiry.inquirerEmail}</p>
                            {inquiry.inquirerPhone && (
                              <p className="text-gray-600">{inquiry.inquirerPhone}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInquiryStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Property:</p>
                          <p className="text-gray-900">{inquiry.property.title}</p>
                          <p className="text-gray-600">{formatPrice(inquiry.property.price)}</p>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                          <p className="text-gray-900">{inquiry.message}</p>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{formatDate(inquiry.createdAt)}</span>
                          <div className="space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              Reply
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              Mark Resolved
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}



            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Analytics & Reports</h2>
                <p className="text-gray-600">Analytics dashboard coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;