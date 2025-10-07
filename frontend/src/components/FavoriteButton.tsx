import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface UserFavoritesProps {
  propertyId: string;
  className?: string;
}

const FavoriteButton: React.FC<UserFavoritesProps> = ({ propertyId, className = '' }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/users/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const favorites = await response.json();
        setIsFavorite(favorites.some((fav: any) => fav._id === propertyId));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [propertyId]);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, checkFavoriteStatus]);

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please login to save favorites');
      return;
    }

    setLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`/api/users/favorites/${propertyId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        alert('Failed to update favorites');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isFavorite 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className="w-5 h-5"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;