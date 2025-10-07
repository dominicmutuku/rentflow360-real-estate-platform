// Main App component for Rentflow360
// Sets up routing, context providers, and global layout

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Homepage from './pages/Homepage';
import PropertyListings from './pages/PropertyListings';
import PropertyDetails from './pages/PropertyDetails';
import PropertyPreview from './pages/PropertyPreview';
import PropertyPhotos from './pages/PropertyPhotos';
import PropertySearch from './pages/PropertySearch';
import PropertySearchResults from './pages/PropertySearchResults';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';

// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 flex flex-col">
          {/* Global Header */}
          <Header />
          
          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              
              {/* Property Routes - 3-Page System */}
              <Route path="/property/:id" element={<PropertyPreview />} />
              <Route path="/property/:id/details" element={<PropertyDetails />} />
              <Route path="/property/:id/photos" element={<PropertyPhotos />} />
              
              {/* Search Routes */}
              <Route path="/search" element={<PropertySearchResults />} />
              <Route path="/properties" element={<PropertySearch />} />
              <Route path="/properties/search" element={<PropertySearchResults />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User Dashboard */}
              <Route path="/dashboard" element={<UserDashboard />} />
              
              {/* Agent Routes */}
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/edit-property/:id" element={<EditProperty />} />
              <Route path="/analytics" element={<Analytics />} />
              
              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          {/* Global Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
