import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="absolute top-2 left-0 right-0 z-10 p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <span className="text-2xl font-bold">Wealth One</span>
          </div>
          <ul className="flex space-x-6">
            <li>
              <NavLink to="/about" className="text-white">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-gray-300">
                Contact
              </NavLink>
            </li>
            <li>
              <a
                href="https://github.com/Samay001"
                className="hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;