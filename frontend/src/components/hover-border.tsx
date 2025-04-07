"use client";
import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function HoverBorderGradientDemo() {
  return (
    <div className="m-6 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="bg-black text-white flex items-center space-x-2 px-6 py-2"
      >
        <span>Try Now</span>
        <DiagonalArrowIcon />
      </HoverBorderGradient>
    </div>
  );
}

const DiagonalArrowIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 19L19 5M19 5H9m10 0v10"
      />
    </svg>
  );
};
