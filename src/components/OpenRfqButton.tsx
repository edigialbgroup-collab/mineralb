"use client";

import React from "react";

interface OpenRfqButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: string;
  product?: string;
}

export default function OpenRfqButton({
  children,
  className = "",
  variant = "",
  product = "Golden Breccia",
}: OpenRfqButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-rfq-modal", {
          detail: { variant, product },
        })
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
