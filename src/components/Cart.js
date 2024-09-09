import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_CART } from '../graphql/queries/cart';
import CartProduct from './CartProduct';

const Cart = ({ userId }) => {
  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(GET_CART, {
    variables: { userId }
  });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartData && cartData.cart) {
      setCart(cartData.cart);
    }
  }, [cartData]);

  if (cartLoading) return <p>Loading cart...</p>;
  if (cartError) return <p>Error: {cartError.message}</p>;

  const handleCheckout = () => {
    if (cart.length > 0) {
      const updatedProducts = products.map(product => {
        const cartItem = cart.find(item => item.productId === product.id);
        return cartItem ? { ...product, quantity: cartItem.quantity } : product;
      });
      console.log(updatedProducts);
      const encodedCart = encodeURIComponent(JSON.stringify(updatedProducts));
      navigate(`/Checkout?cart=${encodedCart}&userId=${userId}`);
    } else {
      window.alert("Cart is empty");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-xl">Cart</h2>
      {cart.length > 0 ? (
        cart.map(item => (
          <CartProduct
            userId={userId}
            key={item.productId}
            setProducts={setProducts}
            id={item.productId}
            quantity={item.quantity}
          />
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Cart;