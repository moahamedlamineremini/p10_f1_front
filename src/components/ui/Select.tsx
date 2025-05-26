import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  return (
    <select
      {...props}
      className="bg-accent-800 text-white px-3 py-2 rounded-md border border-accent-600 focus:outline-none focus:ring focus:ring-primary-500"
    >
      {children}
    </select>
  );
};

export default Select;
