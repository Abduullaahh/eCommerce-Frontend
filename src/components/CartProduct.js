import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCT_BY_ID } from '../graphql/queries/products';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../graphql/mutations/cart';

const CartProduct = ({ setProducts, id, quantity, userId }) => {
	const [quantityToAdd, setQuantityToAdd] = useState(quantity);
	const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, { variables: { id } });

	const [addToCart] = useMutation(ADD_TO_CART);
	const [removeFromCart] = useMutation(REMOVE_FROM_CART);

	const updateProducts = useCallback((product, newQuantity) => {
		setProducts(prevProducts => {
			const productIndex = prevProducts.findIndex(p => p.name === product.name);
			if (productIndex >= 0) {
				return prevProducts.map((p, index) => 
					index === productIndex ? { ...p, quantity: newQuantity } : p
				);
			}
			return [...prevProducts, { ...product, quantity: newQuantity }];
		});
	}, [setProducts]);

	useEffect(() => {
		if (data?.product && quantityToAdd > 0) {
			updateProducts(data.product, quantityToAdd);
		}
	}, [data?.product, quantityToAdd, updateProducts]);

	const handleQuantityChange = useCallback((change) => {
		setQuantityToAdd(prevQuantity => {
			const newQuantity = Math.max(0, prevQuantity + change);
			const mutation = change > 0 ? addToCart : removeFromCart;
			mutation({ variables: { productId: id, quantity: Math.abs(change), userId } });
			return newQuantity;
		});
	}, [id, userId, addToCart, removeFromCart]);

	if (quantityToAdd === 0 || loading || error) return null;

	const { name, description, category, price } = data.product;

	return (
		<div className="cart-product">
			<h2 className="text-xl">{name}</h2>
			<p>Description: {description}</p>
			<p>Category: {category ? category.name : 'Uncategorized'}</p>
			<p>Quantity: {quantityToAdd}</p>
			<p>Price: ${price}</p>
			<div className="flex items-center mt-2">
				<button 
					onClick={() => handleQuantityChange(-1)} 
					className="bg-gray-300 p-2" 
					disabled={quantityToAdd <= 0}
				>
					-
				</button>
				<span className="bg-black text-white px-2 py-1">
					{quantityToAdd}
				</span>
				<button 
					onClick={() => handleQuantityChange(1)} 
					className="bg-gray-300 p-2"
				>
					+
				</button>
			</div>
		</div>
	);
};

export default CartProduct;