import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries/categories';

const Categories = ({ onCategoryChange }) => {
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="mb-4">
      <h3 className="text-lg mb-2">Filter by Category:</h3>
      <select
        onChange={(e) => onCategoryChange(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">All Categories</option>
        {data?.categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Categories;