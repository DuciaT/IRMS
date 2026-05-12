import { motion } from "framer-motion";
import { type MenuItem } from "../../../../features/ordering/types/DOtypes";

//Hiển thị chi tiết từng món ăn trong danh sách lựa chọn, bao gồm trạng thái được chọn (isSelected) và thông tin món (giá, category).
export const ComboItemCard = ({
  item,
  isSelected,
  onToggle,
}: {
  item: MenuItem;
  isSelected: boolean;
  onToggle: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onToggle}
    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
      isSelected
        ? "border-accent bg-accent/10"
        : "border-border bg-muted/20 hover:border-muted"
    }`}
  >
    <div className="flex items-start gap-3">
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
          isSelected ? "border-accent bg-accent" : "border-border bg-background"
        }`}
      >
        {isSelected && (
          <svg
            className="w-3 h-3 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <p style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{item.name}</p>
        <p
          className="text-muted-foreground mt-0.5"
          style={{ fontSize: "0.75rem", lineHeight: 1.4 }}
        >
          {item.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className="text-accent"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            ${item.price}
          </span>
          <span
            className="px-2 py-0.5 bg-muted rounded text-muted-foreground"
            style={{ fontSize: "0.625rem", fontWeight: 600 }}
          >
            {item.category}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);
