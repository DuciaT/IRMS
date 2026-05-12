//Xử lý logic hiển thị nhãn (label) và các tùy chọn (options) tương ứng cho từng loại tùy chỉnh.
export const CustomizationOption = ({
  type,
  value,
  onChange,
}: {
  type: string;
  value: string;
  onChange: (val: string) => void;
}) => {
  const getLabel = (t: string) => {
    const labels: Record<string, string> = {
      "cooking-level": "Cooking Level",
      "sauce-type": "Sauce Type",
      "spice-level": "Spice Level",
      size: "Size",
    };
    return labels[t] || t;
  };

  return (
    <div className="space-y-2">
      <label
        className="block"
        style={{ fontSize: "0.875rem", fontWeight: 600 }}
      >
        {getLabel(type)}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none"
      >
        <option value="">Select option...</option>
        {type === "cooking-level" && (
          <>
            <option value="rare">Rare</option>
            <option value="medium-rare">Medium Rare</option>
            <option value="medium">Medium</option>
            <option value="medium-well">Medium Well</option>
            <option value="well-done">Well Done</option>
          </>
        )}
        {type === "sauce-type" && (
          <>
            <option value="truffle">Truffle Reduction</option>
            <option value="pepper">Pepper Sauce</option>
            <option value="mushroom">Mushroom Sauce</option>
            <option value="none">No Sauce</option>
          </>
        )}
        {type === "spice-level" && (
          <>
            <option value="mild">Mild</option>
            <option value="medium">Medium</option>
            <option value="hot">Hot</option>
            <option value="extra-hot">Extra Hot</option>
          </>
        )}
        {type === "size" && (
          <>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </>
        )}
      </select>
    </div>
  );
};
