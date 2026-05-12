interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export const FormField = ({ label, children }: FormFieldProps) => (
  <div>
    <label
      className="block mb-2"
      style={{ fontSize: "0.875rem", fontWeight: 600 }}
    >
      {label}
    </label>
    {children}
  </div>
);
