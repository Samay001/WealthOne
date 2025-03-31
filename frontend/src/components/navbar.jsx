"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="absolute top-2 left-0 right-0 z-10 p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">Wealth One</span>
          </div>

          {/* Hide Nav Items When Menu is Open */}
          <ul
            className={`md:flex items-center space-x-6 ${
              isMenuOpen ? "flex" : "hidden"
            }`}
          >
            <li>
              <Link
                href="#"
                className="text-white hover:text-gray-300 transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white hover:text-gray-300 transition"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="bg-blue-500 text-gray-200 px-5 py-1.5 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Login
              </Link>
            </li>
          </ul>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none z-50 relative"
            aria-label="Toggle Menu"
          >
            <div className="w-6 space-y-1.5 transform transition duration-300 ease-in-out">
              <div
                className={`h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>
              <div
                className={`h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></div>
              <div
                className={`h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            </div>
          </button>

          {/* Popup Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl z-40 md:hidden"
              >
                <div className="container mx-auto px-4 pt-24 pb-10">
                  {/* Close Button */}
                  <button
                    onClick={toggleMenu}
                    className="absolute top-6 right-4 text-gray-600 hover:text-gray-900 transition"
                    aria-label="Close Menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Menu Items */}
                  <div className="flex flex-col space-y-6 items-start">
                    <Link
                      href="/about"
                      className="text-gray-800 text-xl hover:text-blue-600 transition"
                      onClick={toggleMenu}
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="text-gray-800 text-xl hover:text-blue-600 transition"
                      onClick={toggleMenu}
                    >
                      Contact
                    </Link>
                    <button
                      className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition duration-300 text-lg"
                      onClick={toggleMenu}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
