import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl, API_ENDPOINTS, API_BASE_URL } from '../utils/config';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AdminStats {
  overview: {
    totalUsers: number;
    totalAgents: number;
    totalProperties: number;
    totalInquiries: number;
    activeListings: number;
    pendingProperties: number;
    monthlyRevenue: number;
    systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  };
  userGrowth: Array<{
    month: string;
    users: number;
    agents: number;
    properties: number;
  }>;
  propertyStats: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  locationStats: Array<{
    city: string;
    properties: number;
    users: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'user_registration' | 'property_added' | 'inquiry_sent' | 'payment' | 'report';
    description: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error';
  }>;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'agent' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
  totalProperties?: number;
  totalInquiries?: number;
}

interface Property {
  _id: string;
  title: string;
  type: string;
  price: number;
  location: {
    city: string;
    area: string;
  };
  agent: {
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'active' | 'inactive' | 'pending' | 'flagged';
  createdAt: string;
  views: number;
  inquiries: number;
  isReported: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');

  // Pagination and filters
  const [userPage, setUserPage] = useState(1);
  const [propertyPage, setPropertyPage] = useState(1);
  const [userFilter, setUserFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const usersPerPage = 10;
  const propertiesPerPage = 10;

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    fetchAdminData();
  }, [user, selectedTimeframe]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rentflow360_token');
      console.log('Admin Dashboard Token:', token ? 'Token found' : 'No token found');
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('API_ENDPOINTS.ADMIN.STATS:', API_ENDPOINTS.ADMIN.STATS);
      console.log('Fetching admin data from:', buildApiUrl(API_ENDPOINTS.ADMIN.STATS));
      const [statsResponse, usersResponse, propertiesResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/admin/stats?timeframe=${selectedTimeframe}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('rentflow360_token')}` }
        }),
        fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('rentflow360_token')}` }
        }),
        fetch('http://localhost:5000/api/admin/properties', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('rentflow360_token')}` }
        })
      ]);

      console.log('API Response statuses:', {
        stats: statsResponse.status,
        users: usersResponse.status,
        properties: propertiesResponse.status
      });

      if (statsResponse.ok && usersResponse.ok && propertiesResponse.ok) {
        const [stats, usersData, propertiesData] = await Promise.all([
          statsResponse.json(),
          usersResponse.json(),
          propertiesResponse.json()
        ]);

        setAdminStats(stats);
        setUsers(usersData);
        setProperties(propertiesData);
      } else {
        console.error('Failed to fetch admin data:', {
          stats: !statsResponse.ok ? await statsResponse.text() : 'OK',
          users: !usersResponse.ok ? await usersResponse.text() : 'OK',
          properties: !propertiesResponse.ok ? await propertiesResponse.text() : 'OK'
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'promote' | 'demote' | 'delete') => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ADMIN.USER_ACTION(userId, action)), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('rentflow360_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchAdminData();
        alert(`User ${action} successful`);
      } else {
        alert(`Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      alert(`Error ${action} user`);
    }
  };

  const handlePropertyAction = async (propertyId: string, action: 'approve' | 'reject' | 'flag' | 'unflag' | 'delete') => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ADMIN.PROPERTY_ACTION(propertyId, action)), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('rentflow360_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchAdminData();
        alert(`Property ${action} successful`);
      } else {
        alert(`Failed to ${action} property`);
      }
    } catch (error) {
      console.error(`Error ${action} property:`, error);
      alert(`Error ${action} property`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivitySeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = userFilter === 'all' || user.role === userFilter;
    const matchesSearch = searchQuery === '' || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredProperties = properties.filter(property => {
    const matchesFilter = propertyFilter === 'all' || property.status === propertyFilter;
    const matchesSearch = searchQuery === '' || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.agent.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminStats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load admin data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Platform management and oversight</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSystemHealthColor(adminStats.overview.systemHealth)}`}>
                System: {adminStats.overview.systemHealth.charAt(0).toUpperCase() + adminStats.overview.systemHealth.slice(1)}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'users', name: 'User Management' },
                { id: 'properties', name: 'Property Moderation' },
                { id: 'analytics', name: 'Analytics' },
                { id: 'activity', name: 'Activity Log' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatNumber(adminStats.overview.totalUsers)}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Agents</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatNumber(adminStats.overview.totalAgents)}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatNumber(adminStats.overview.totalProperties)}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatCurrency(adminStats.overview.monthlyRevenue)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={adminStats.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" name="Users" />
                    <Area type="monotone" dataKey="agents" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Agents" />
                    <Area type="monotone" dataKey="properties" stackId="1" stroke="#ffc658" fill="#ffc658" name="Properties" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Property Status Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={adminStats.propertyStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percentage }) => `${status}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {adminStats.propertyStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Location Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Locations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adminStats.locationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="properties" fill="#8884d8" name="Properties" />
                  <Bar yAxisId="left" dataKey="users" fill="#82ca9d" name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="user">Regular Users</option>
                  <option value="agent">Agents</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage).map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'agent'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.role === 'agent' && (
                            <div>
                              <div>Properties: {user.totalProperties || 0}</div>
                              <div>Inquiries: {user.totalInquiries || 0}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            {user.isActive ? (
                              <button
                                onClick={() => handleUserAction(user._id, 'deactivate')}
                                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-300 rounded"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction(user._id, 'activate')}
                                className="text-green-600 hover:text-green-900 text-xs px-2 py-1 border border-green-300 rounded"
                              >
                                Activate
                              </button>
                            )}
                            {user.role === 'user' && (
                              <button
                                onClick={() => handleUserAction(user._id, 'promote')}
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-300 rounded"
                              >
                                Promote
                              </button>
                            )}
                            {user.role === 'agent' && (
                              <button
                                onClick={() => handleUserAction(user._id, 'demote')}
                                className="text-yellow-600 hover:text-yellow-900 text-xs px-2 py-1 border border-yellow-300 rounded"
                              >
                                Demote
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setUserPage(Math.max(1, userPage - 1))}
                    disabled={userPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setUserPage(userPage + 1)}
                    disabled={userPage * usersPerPage >= filteredUsers.length}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(userPage - 1) * usersPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(userPage * usersPerPage, filteredUsers.length)}</span> of{' '}
                      <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setUserPage(Math.max(1, userPage - 1))}
                        disabled={userPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setUserPage(userPage + 1)}
                        disabled={userPage * usersPerPage >= filteredUsers.length}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Property Moderation Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Property Moderation</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Properties</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending Review</option>
                  <option value="flagged">Flagged</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProperties.slice((propertyPage - 1) * propertiesPerPage, propertyPage * propertiesPerPage).map((property) => (
                      <tr key={property._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{property.title}</div>
                            <div className="text-sm text-gray-500">
                              {property.type} • {property.location.area}, {property.location.city}
                            </div>
                            <div className="text-xs text-gray-400">
                              Listed: {formatDate(property.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {property.agent.firstName} {property.agent.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{property.agent.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              property.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : property.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : property.status === 'flagged'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {property.status}
                            </span>
                            {property.isReported && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                Reported
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(property.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>Views: {formatNumber(property.views)}</div>
                          <div>Inquiries: {formatNumber(property.inquiries)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex flex-col space-y-1">
                            {property.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handlePropertyAction(property._id, 'approve')}
                                  className="text-green-600 hover:text-green-900 text-xs px-2 py-1 border border-green-300 rounded"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handlePropertyAction(property._id, 'reject')}
                                  className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-300 rounded"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {property.status === 'active' && (
                              <button
                                onClick={() => handlePropertyAction(property._id, 'flag')}
                                className="text-yellow-600 hover:text-yellow-900 text-xs px-2 py-1 border border-yellow-300 rounded"
                              >
                                Flag
                              </button>
                            )}
                            {property.status === 'flagged' && (
                              <button
                                onClick={() => handlePropertyAction(property._id, 'unflag')}
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-300 rounded"
                              >
                                Unflag
                              </button>
                            )}
                            <button
                              onClick={() => handlePropertyAction(property._id, 'delete')}
                              className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-300 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Property Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPropertyPage(Math.max(1, propertyPage - 1))}
                    disabled={propertyPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPropertyPage(propertyPage + 1)}
                    disabled={propertyPage * propertiesPerPage >= filteredProperties.length}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(propertyPage - 1) * propertiesPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(propertyPage * propertiesPerPage, filteredProperties.length)}</span> of{' '}
                      <span className="font-medium">{filteredProperties.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setPropertyPage(Math.max(1, propertyPage - 1))}
                        disabled={propertyPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPropertyPage(propertyPage + 1)}
                        disabled={propertyPage * propertiesPerPage >= filteredProperties.length}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
            
            {/* Detailed Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Trend */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={adminStats.locationStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity by Location</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={adminStats.locationStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {adminStats.overview.totalInquiries > 0 
                    ? ((adminStats.overview.totalInquiries / adminStats.overview.totalProperties) * 100).toFixed(1)
                    : 0}%
                </p>
                <p className="text-sm text-gray-600 mt-1">Inquiries per property</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Listings</h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatNumber(adminStats.overview.activeListings)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Currently available</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Review</h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatNumber(adminStats.overview.pendingProperties)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Awaiting approval</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Activity Log</h2>
            
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {adminStats.recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.severity === 'error' 
                            ? 'bg-red-400'
                            : activity.severity === 'warning'
                            ? 'bg-yellow-400'
                            : 'bg-blue-400'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(activity.timestamp)}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActivitySeverityColor(activity.severity)}`}>
                        {activity.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;