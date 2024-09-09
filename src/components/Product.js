import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TO_CART } from '../graphql/mutations/cart';
import { DELETE_PRODUCT, UPDATE_PRODUCT } from '../graphql/mutations/product';

const Product = ({ product, userId, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: product.name,
    description: product.description,
    categoryId: product.category?.id || '',
    quantity: product.quantity,
    price: product.price,
  });

  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [addToCart] = useMutation(ADD_TO_CART);
  const [update_Product] = useMutation(UPDATE_PRODUCT);
  const [delete_Product] = useMutation(DELETE_PRODUCT);
  console.log(userId);

  const handleAddToCart = async () => {
    try {
      console.log("Adding to cart with variables:", { productId: product.id, quantity: quantityToAdd, userId });
      await addToCart({ variables: { productId: product.id, quantity: quantityToAdd, userId: userId } });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    update_Product({
      variables: {
        id: product.id,
        name: editedProduct.name,
        description: editedProduct.description,
        categoryId: editedProduct.categoryId,
        quantity: parseInt(editedProduct.quantity, 10),
        price: parseInt(editedProduct.price, 10),
      },
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const deleteProduct = () => {
    delete_Product({ variables: { id: product.id } });
  };

  const handleQuantityChange = (increment) => {
    setQuantityToAdd(prev => Math.max(1, prev + increment));
  };

  return (
    <div className="border p-4 m-2">
      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={editedProduct.name}
            onChange={handleInputChange}
            className="border p-2 w-full"
          /><br/>
          <textarea
            name="description"
            value={editedProduct.description}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          /><br/>
          <select
            name="categoryId"
            value={editedProduct.categoryId}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select><br/>
          <input
            type="number"
            name="quantity"
            value={editedProduct.quantity}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          /><br/>
          <input
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          /><br/>
          <button onClick={handleSaveClick} className="bg-green-500 text-white p-2 mt-2">Save</button>
        </>
      ) : (
        <>
          <h2 className="text-xl">{product.name}</h2>
          <p>Description: {product.description}</p>
          <p>Category: {product.category ? product.category.name : 'Uncategorized'}</p>
          <p>Quantity: {product.quantity}</p>
          <p>Price: ${product.price}</p>
          <div className="flex items-center mt-2">
            <button onClick={() => handleQuantityChange(-1)} className="bg-gray-300 p-2">-</button>
            <span style={{backgroundColor:'black', color:'white', padding:'1px 5px'}}>{quantityToAdd}</span>
            <button onClick={() => handleQuantityChange(1)} className="bg-gray-300 p-2">+</button>
          </div>
          <button onClick={handleAddToCart} className="bg-blue-500 text-white p-2 mt-2 ml-2">Add to Cart</button>
          <button onClick={handleUpdateClick} className="bg-blue-500 text-white p-2 mt-2">Update</button>
        </>
      )}
      <button onClick={deleteProduct} className="bg-red-500 text-white p-2 mt-2">Delete</button>
    </div>
  );
};

export default Product;