import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-gray-800 text-white shadow-md">
    <div className="container mx-auto flex justify-between items-center p-4">
      <h1 className="text-3xl font-bold">GQL Store</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/Home" className="hover:text-yellow-400 transition-colors">Home</Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-yellow-400 transition-colors">Cart</Link>
          </li>
          <li>
            <Link to="/AssignJobs" className="hover:text-yellow-400 transition-colors">Assign Delivery</Link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;