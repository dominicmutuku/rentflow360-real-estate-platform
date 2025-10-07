import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteButton from '../components/FavoriteButton';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: {
    city: string;
    area: string;
  };
  images: string[];
  type: string;
  bedrooms: number;
  bathrooms: number;
  createdAt: string;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: any;
  createdAt: string;
}

interface Alert {
  alert: SavedSearch;
  matches: Property[];
  count: number;
}

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalFavorites: 0,
    totalSavedSearches: 0,
    newAlerts: 0,
    profileCompletion: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch all dashboard data in parallel
      const [favoritesRes, searchesRes, alertsRes] = await Promise.all([
        fetch('/api/users/favorites', { headers }),
        fetch('/api/properties/searches/saved', { headers }),
        fetch('/api/users/alerts', { headers })
      ]);

      if (favoritesRes.ok) {
        const favoritesData = await favoritesRes.json();
        setFavorites(favoritesData);
      }

      if (searchesRes.ok) {
        const searchesData = await searchesRes.json();
        setSavedSearches(searchesData);
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.data || []);
      }

      // Calculate stats
      setUserStats({
        totalFavorites: favorites.length,
        totalSavedSearches: savedSearches.length,
        newAlerts: alerts.reduce((acc, alert) => acc + alert.count, 0),
        profileCompletion: calculateProfileCompletion()
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let completed = 0;
    const fields = ['firstName', 'lastName', 'email', 'phone'];
    fields.forEach(field => {
      if (user[field as keyof typeof user]) completed += 25;
    });
    return completed;
  };

  const handleRemoveFavorite = (propertyId: string) => {
    setFavorites(prev => prev.filter(prop => prop._id !== propertyId));
    setUserStats(prev => ({ ...prev, totalFavorites: prev.totalFavorites - 1 }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
                  <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
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
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'favorites' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ❤️ Favorites ({userStats.totalFavorites})
                </button>
                <button
                  onClick={() => setActiveTab('searches')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'searches' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🔍 Saved Searches ({userStats.totalSavedSearches})
                </button>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'alerts' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🔔 Alerts {userStats.newAlerts > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-1">
                      {userStats.newAlerts}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👤 Profile Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-100 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Favorites</p>
                        <p className="text-2xl font-semibold text-gray-900">{userStats.totalFavorites}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Saved Searches</p>
                        <p className="text-2xl font-semibold text-gray-900">{userStats.totalSavedSearches}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2L13.09 8.26L20 9L15 14L16.18 21L10 17.77L3.82 21L5 14L0 9L6.91 8.26L10 2Z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">New Alerts</p>
                        <p className="text-2xl font-semibold text-gray-900">{userStats.newAlerts}</p>
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
                        <p className="text-sm font-medium text-gray-600">Profile Complete</p>
                        <p className="text-2xl font-semibold text-gray-900">{userStats.profileCompletion}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                  </div>
                  <div className="p-6">
                    {favorites.length === 0 && savedSearches.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-500">No recent activity</p>
                        <p className="text-sm text-gray-400 mt-1">Start by browsing properties and saving your favorites!</p>
                        <Link
                          to="/properties/search"
                          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Browse Properties
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {favorites.slice(0, 3).map(property => (
                          <div key={property._id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden">
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
                              <div className="ml-4">
                                <h3 className="font-medium text-gray-800">{property.title}</h3>
                                <p className="text-sm text-gray-600">
                                  {property.location.area}, {property.location.city}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Added to favorites • {formatDate(property.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">{formatPrice(property.price)}</p>
                              <p className="text-sm text-gray-500">{property.type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
                  <p className="text-gray-600">{favorites.length} properties</p>
                </div>

                {favorites.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-xl text-gray-600 mb-2">No favorites yet</p>
                    <p className="text-gray-500 mb-6">Save properties you're interested in to view them here</p>
                    <Link
                      to="/properties/search"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map(property => (
                      <div key={property._id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="relative">
                          <img
                            src={property.images[0] || '/placeholder-property.jpg'}
                            alt={property.title}
                            className="w-full h-48 object-cover"
                          />
                          <FavoriteButton
                            propertyId={property._id}
                            className="absolute top-3 right-3"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2">{property.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {property.location.area}, {property.location.city}
                          </p>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-blue-600 font-bold">{formatPrice(property.price)}</span>
                            <span className="text-gray-500 text-sm capitalize">{property.type}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                            <span>{property.bedrooms} beds</span>
                            <span>{property.bathrooms} baths</span>
                          </div>
                          <Link
                            to={`/property/${property._id}`}
                            className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other tabs would be implemented similarly... */}
            {activeTab === 'searches' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Saved Searches</h2>
                <p className="text-gray-600">Saved searches feature coming soon...</p>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Property Alerts</h2>
                <p className="text-gray-600">Property alerts feature coming soon...</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
                <p className="text-gray-600">Profile settings feature coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;