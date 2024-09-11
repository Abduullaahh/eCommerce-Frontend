import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { payments } from '@square/web-sdk';
import { CHECKOUT } from '../graphql/mutations/checkout';

const Checkout = ({ userId }) => {
  const [checkout] = useMutation(CHECKOUT);
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const cart = JSON.parse(decodeURIComponent(queryParams.get('cart') || '[]'));
  const [paymentStatus, setPaymentStatus] = useState('');

  // Calculate subtotals and grand total
  const cartWithSubtotals = cart.map(item => ({
    ...item,
    subtotal: item.price * item.quantity
  }));
  const grandTotal = cartWithSubtotals.reduce((total, item) => total + item.subtotal, 0);

  useEffect(() => {
    const initializePaymentForm = async () => {
      try {
        const paymentsInstance = await payments(process.env.REACT_APP_SQUARE_APPLICATION_ID, process.env.REACT_APP_SQUARE_LOCATION_ID);
        const card = await paymentsInstance.card();
        await card.attach('#card-container');
        document.getElementById('card-button').addEventListener('click', async () => {
          const result = await card.tokenize();
          if (result.status === 'OK') {
            handlePaymentMethodSubmission(result.token);
          } else {
            setPaymentStatus('Payment failed: ' + result.errors[0].message);
          }
        });
      } catch (error) {
        console.error('Error initializing payment form:', error);
        setPaymentStatus('Error initializing payment form');
      }
    };

    initializePaymentForm();
  }, []);

  const handlePaymentMethodSubmission = async (token) => {
    try {
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
            grandTotal,
            paymentToken: token
          }
        }
      });

      if (data.checkout.success) {
        setPaymentStatus('Payment successful');
        console.log(`Order placed successfully. Order ID: ${data.checkout.orderId}`);
        navigate('/Home');
      } else {
        setPaymentStatus('Payment failed: ' + data.checkout.message);
      }
    } catch (error) {
      setPaymentStatus('Payment failed: ' + error.message);
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
      
      <div id="card-container" className="mt-4"></div>
      <button id="card-button" className="bg-green-500 text-white p-2 mt-4">Complete Purchase</button>
      
      {paymentStatus && <p className="mt-4">{paymentStatus}</p>}
      
      {/* <button onClick={handleCheckout} className="bg-green-500 text-white p-2">Complete Purchase</button> */}
    </div>
  );
};

export default Checkout;
