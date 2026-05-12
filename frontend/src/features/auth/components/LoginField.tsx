import React from 'react';

interface FormFieldProps {
  label: string;
  icon: React.ElementType;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const FormField = ({ label, icon: Icon, type, value, onChange, placeholder }: FormFieldProps) => {
  return (
    <div>
      <label className="block mb-2" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
};