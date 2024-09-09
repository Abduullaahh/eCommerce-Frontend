import React, { useState } from 'react';
import Modal from 'react-modal';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PRODUCT } from '../graphql/mutations/product';
import { GET_CATEGORIES } from '../graphql/queries/categories';
import { ADD_CATEGORY } from '../graphql/mutations/categories';
import { MdClose } from 'react-icons/md';

Modal.setAppElement('#root');

const ProductModal = ({ isOpen, onRequestClose }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: 0,
    price: 0,
  });
  const [newCategory, setNewCategory] = useState('');
  const [category, setCategory] = useState('');

  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useQuery(GET_CATEGORIES);
  const [addProduct, { loading: addProductLoading, error: addProductError }] = useMutation(ADD_PRODUCT);
  const [addCategory] = useMutation(ADD_CATEGORY);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setProductData({ ...productData, category: '' });
    } else {
      setProductData({ ...productData, category: value });
    }
  };

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        await addCategory({ variables: { name: newCategory } });
        await refetchCategories();
        setProductData({ ...productData, category: newCategory });
        setNewCategory('');
      } catch (error) {
        console.error('Error adding new category:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({
        variables: {
          name: productData.name,
          description: productData.description,
          price: parseInt(productData.price),
          quantity: parseInt(productData.quantity),
          categoryId: category
        }
      });
      onRequestClose();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Product"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-container relative max-w-lg mx-auto my-8 bg-white border border-secondary-light shadow-lg rounded-lg p-6">
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <MdClose size={24} />
        </button>
        <h2 className="text-2xl mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Description:</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Price:</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Category:</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a category</option>
              {!categoriesLoading &&
                categoriesData?.categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              <option value="new">Add new category</option>
            </select>
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categoriesData?.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {productData.category === '' && (
            <div className="mb-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="mt-2 bg-green-500 text-white p-2 rounded"
              >
                Add Category
              </button>
            </div>
          )}
          <button
            type="submit"
            className={`bg-teal-500 text-white p-2 rounded ${addProductLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={addProductLoading}
          >
            {addProductLoading ? 'Adding...' : 'Add Product'}
          </button>
          {addProductError && <p className="text-red-500 mt-2">Error adding product: {addProductError.message}</p>}
        </form>
      </div>
    </Modal>
  );
};

export default ProductModal;
