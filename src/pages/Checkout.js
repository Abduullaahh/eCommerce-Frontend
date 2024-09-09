import React from 'react';
import { useMutation } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { CHECKOUT } from '../graphql/mutations/checkout';

const Checkout = ({userId}) => {
  const [checkout] = useMutation(CHECKOUT);
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const cart = JSON.parse(decodeURIComponent(queryParams.get('cart') || '[]'));
  console.log('Cart data:', cart, userId);

  // Calculate subtotals and grand total
  const cartWithSubtotals = cart.map(item => ({
    ...item,
    subtotal: item.price * item.quantity
  }));
  const grandTotal = cartWithSubtotals.reduce((total, item) => total + item.subtotal, 0);

  const handleCheckout = async () => {
    try {
      // Format cart data to match the schema
      const formattedCart = cartWithSubtotals.map(item => ({
        productId: item.id, // Assuming the product has an 'id' field
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      }));

      const { data } = await checkout({
        variables: {
          input: {
            userId,
            cart: formattedCart,
            grandTotal
          }
        }
      });
      if (data.checkout.success) {
        console.log(`Order placed successfully. Order ID: ${data.checkout.orderId}`);
        // Redirect to home page after successful checkout
        navigate('/Home');
      } else {
        // Handle unsuccessful checkout
        console.error(data.checkout.message);
      }
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error('Checkout failed:', error.message);
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-xl">Checkout</h2>
      <h3 className="text-lg">Products:</h3>
      {cartWithSubtotals.length > 0 ? (
        <ul>
          {cartWithSubtotals.map((product, index) => (
            <li key={index} className="mb-2">
              <p><strong>Name:</strong> {product.name}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
              <p><strong>Subtotal:</strong> ${product.subtotal.toFixed(2)}</p>
            </li>
          ))}
          <li className="mt-4 font-bold">
            <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>
          </li>
        </ul>
      ) : (
        <p>No products in the cart.</p>
      )}
      <button onClick={handleCheckout} className="bg-green-500 text-white p-2">Complete Purchase</button>
    </div>
  );
};

export default Checkout;
