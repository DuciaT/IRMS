import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { type MenuItem } from "../../types/MMtypes";
import { CardVisuals } from "./CardVisuals";
import { CardFooter } from "./CardFooter";

export interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  promotions: any[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string, name: string) => void;
}

//Xử lý logic hiển thị các chất gây dị ứng.
const AllergenList = ({ allergens }: { allergens?: string[] }) => {
  if (!allergens || allergens.length === 0) return null;
  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      <AlertCircle className="w-3 h-3 text-orange-500" />
      {allergens.map((allergen) => (
        <span
          key={allergen}
          className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded font-semibold text-[0.625rem]"
        >
          {allergen}
        </span>
      ))}
    </div>
  );
};

//Xử lý logic hiển thị chi tiết nội dung khuyến mãi.
const PromotionInfo = ({ activePromo }: { activePromo: any }) => {
  if (!activePromo) return null;
  return (
    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
      <p className="text-yellow-800 font-semibold text-[0.75rem]">
        {activePromo.name}:{" "}
        {activePromo.type === "percentage"
          ? `${activePromo.value}% OFF`
          : `$${activePromo.value} OFF`}
      </p>
    </div>
  );
};

export default function MenuItemCard({
  item,
  index,
  promotions,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  const activePromo = item.promotionId
    ? promotions.find((p) => p.id === item.promotionId && p.active)
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="bg-card rounded-xl border border-border shadow-lg overflow-hidden flex flex-col"
    >
      <CardVisuals item={item} activePromo={activePromo} />

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-base">{item.name}</h3>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-[0.75rem] leading-[1.4]">
          {item.description}
        </p>

        <AllergenList allergens={item.allergens} />

        <PromotionInfo activePromo={activePromo} />

        <CardFooter item={item} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </motion.div>
  );
}
