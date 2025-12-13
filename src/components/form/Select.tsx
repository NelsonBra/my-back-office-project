import React from "react";
import Label from "./Label";

interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  placeholder?: string;
  id?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  name?: string;
  label?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Selecione um aluno",
  onChange,
  className = "",
  name = "",
  label = "",
  id,
  value = "",
}) => {
  return (
    <div className="relative">
      {label && <Label htmlFor={id}>{label}</Label>}

      <select
        id={id}
        name={name}
        value={value}            
        onChange={onChange}    
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 
        px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 
        focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 
        dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 
        dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
