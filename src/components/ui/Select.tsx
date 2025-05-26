import React from 'react';

interface SelectProps {
  label: string;
  value?: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: number; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-accent-200 mb-1">{label}</label>
      <select
        value={value ?? ''}
        onChange={onChange}
        className="block w-full p-2 border border-accent-700 rounded-md bg-accent-900 text-white"
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
