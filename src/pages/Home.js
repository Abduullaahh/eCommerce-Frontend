import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import ProductList from '../components/ProductList';
import ProductModal from '../components/ProductModal';
import { GET_CATEGORIES } from '../graphql/queries/categories';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const location = useLocation();
  const userId = location.state?.userId;

  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl text-center my-4">Welcome to Our Store</h1>
      
      <div className="mb-4">
        <h3 className="text-lg mb-2">Filter by Category:</h3>
        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : categoriesError ? (
          <p>Error loading categories: {categoriesError.message}</p>
        ) : (
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categoriesData?.categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <ProductList userId={userId} categoryFilter={selectedCategory} categories={categoriesData?.categories} />
      
      <button 
        onClick={openModal} 
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Add Product
      </button>
      
      <ProductModal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
      />
    </div>
  );
};

export default Home;