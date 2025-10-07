// Search Results page
// Displays filtered property search results

import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Search Results
        </h1>
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold mb-4">Search Filters:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(filters, null, 2)}
          </pre>
          <p className="text-gray-600 text-lg mt-6">
            Search results page will be implemented in the next phase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;