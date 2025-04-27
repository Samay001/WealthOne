"use client";
import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";
// import Image from "next/image";

const Main = () => {
  return (
    <div
      data-framer-background-image-wrapper="true"
      className="absolute inset-0 z-0 bg-cover bg-center "
      style={{
        backgroundImage:
          "url('https://framerusercontent.com/images/4VX0PEAzbHMFjS7HeLo6v4CcP0.png')",
        filter: "brightness(0.95)",
      }}
    >
      
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/3 w-60 h-60 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-3xl z-10"></div>

      <div className="absolute top-[40%] sm:top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white max-w-4xl w-4/5 p-6 mt-4">
        <div className="mb-6 mt-8 flex items-center justify-center space-x-2">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <p className="text-sm font-light tracking-wide text-blue-300 sm:text-base">
            The best investment you can make is in understanding your
            investments.
          </p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>
        <h1 className="mb-4 max-w-4xl text-4xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-7xl">
          AI Agents That
          <br />
          Helps You <span className="text-blue-400">Understand</span>,<br />
          And <span className="text-blue-400">Optimised</span> .
        </h1>
        <p className="mb-6 text-sm font-light tracking-wide text-gray-300 sm:text-base">
          Manage all your portfolio at same place.
        </p>
        <div className=" flex justify-center text-center">
          <Link href={"/dashboard"} type="button">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black dark:text-white flex items-center space-x-2"
            >
              <span>Try Now</span>
            </HoverBorderGradient>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main;
