import React from 'react';

interface Option {
  value: number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  value?: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-accent-200 mb-1">{label}</label>
      <select
        value={value ?? ''}
        onChange={onChange}
        className="block w-full p-2 border border-accent-700 rounded-md bg-accent-900 text-white focus:outline-none focus:ring focus:ring-primary-500"
        {...props}
      >
        <option value="">-- Choisir --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
