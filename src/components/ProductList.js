import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries/products';
import Product from './Product';

const ProductList = ({ userId, categoryFilter, categories }) => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredProducts = categoryFilter
    ? data.products.filter(product => product.category && product.category.name === categoryFilter)
    : data.products;

  console.log('Filtered products:', filteredProducts);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map(product => (
        <Product key={product.id} product={product} userId={userId} categories={categories} />
      ))}
    </div>
  );
};

export default ProductList;