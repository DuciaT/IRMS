//Hiển thị các đoạn text đơn giản (Location, Items, Time, Total) với style nhất quán.
export const TextCell = ({
  value,
  className = "text-foreground",
  isDisplayFont = false,
}: {
  value: string | number;
  className?: string;
  isDisplayFont?: boolean;
}) => (
  <td className="p-4">
    <span
      className={className}
      style={{
        fontSize: "0.875rem",
        fontWeight: isDisplayFont ? 600 : "normal",
        fontFamily: isDisplayFont ? "var(--font-display)" : undefined,
      }}
    >
      {value}
    </span>
  </td>
);
