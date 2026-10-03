import React from "react";

export const Text = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={`text-base ${className}`}>{children}</p>;
};