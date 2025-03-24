import React from "react";
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="absolute top-2 left-0 right-0 z-10 p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">Wealth One</span>
          </div>
          <ul className="flex space-x-6">
            <li>
              <Link href="/about" className="text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white">
                Contact
              </Link>
            </li>
            <li className="text-white">
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