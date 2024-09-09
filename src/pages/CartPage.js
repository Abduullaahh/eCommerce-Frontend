import React from 'react';
import Cart from '../components/Cart';

const CartPage = ({userId}) => (
  <div>
    <h1 className="text-3xl text-center my-4">Your Cart</h1>
    <Cart userId={userId} />
  </div>
);

export default CartPage;