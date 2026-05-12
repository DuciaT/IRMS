import type { ReactNode } from "react";

interface FieldWrapperProps {
  label: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

// Wrapper chung để quản lý Label và Layout
const FieldWrapper = ({
  label,
  children,
  className = "",
  required,
}: FieldWrapperProps) => (
  <div className={className}>
    <label className="block mb-2 text-sm font-semibold">
      {label} {required && "*"}
    </label>
    {children}
  </div>
);

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField = ({ label, required, ...props }: InputFieldProps) => (
  <FieldWrapper
    label={label}
    required={required}
    className={props.type === "number" ? "" : "col-span-2"}
  >
    <input
      {...props}
      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
    />
  </FieldWrapper>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const SelectField = ({
  label,
  options,
  required,
  ...props
}: SelectFieldProps) => (
  <FieldWrapper label={label} required={required}>
    <select
      {...props}
      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
    >
      <option value="">Select {label.toLowerCase()}...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </FieldWrapper>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextAreaField = ({ label, ...props }: TextAreaFieldProps) => (
  <FieldWrapper label={label} className="col-span-2">
    <textarea
      {...props}
      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none resize-none"
    />
  </FieldWrapper>
);

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const CheckboxField = ({ label, ...props }: CheckboxFieldProps) => (
  <div className="col-span-2">
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        {...props}
        type="checkbox"
        className="w-5 h-5 rounded border-border text-primary focus:ring-accent"
      />
      <span className="text-sm font-semibold">{label}</span>
    </label>
  </div>
);
