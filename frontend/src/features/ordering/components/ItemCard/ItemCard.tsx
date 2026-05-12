import { motion } from "framer-motion";
import { Package, AlertCircle } from "lucide-react";
import { type MenuItem } from "../../types/DOtypes";
import { ItemFooter } from "./ItemFooter";

export interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  promotions: any[];
  openComboModal: (item: MenuItem) => void;
  openCustomizationModal: (item: MenuItem) => void;
  addToCart: (item: MenuItem) => void;
}

//Hiển thị hình ảnh và các trạng thái đè lên ảnh (Badges như Promo, Out of Stock).
const ItemImage = ({
  item,
  promotions,
}: {
  item: MenuItem;
  promotions: any[];
}) => {
  const activePromo =
    item.promotionId &&
    promotions.find((p) => p.id === item.promotionId && p.active);

  return (
    <div className="h-40 bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span style={{ fontFamily: "var(--font-display)", fontSize: "3rem" }}>
          🍽️
        </span>
      )}

      {!item.available && (
        <div
          className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
          style={{ fontSize: "0.65rem", fontWeight: 600 }}
        >
          OUT OF STOCK
        </div>
      )}

      {activePromo && (
        <div
          className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white rounded"
          style={{ fontSize: "0.65rem", fontWeight: 600 }}
        >
          🎉 PROMO
        </div>
      )}
    </div>
  );
};

//Hiển thị thông tin văn bản (Tên, mô tả, nhãn Combo).
const ItemInfo = ({ item }: { item: MenuItem }) => (
  <>
    <div className="flex items-start justify-between gap-2">
      <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{item.name}</h3>
      {item.isCombo && (
        <span
          className="px-2 py-1 bg-accent/20 text-accent rounded-full flex items-center gap-1"
          style={{ fontSize: "0.625rem", fontWeight: 700 }}
        >
          <Package className="w-3 h-3" />
          COMBO
        </span>
      )}
    </div>
    <p
      className="text-muted-foreground mt-1 flex-1"
      style={{ fontSize: "0.75rem", lineHeight: 1.4 }}
    >
      {item.description}
    </p>
  </>
);

//Hiển thị danh sách các chất gây dị ứng.
const ItemAllergens = ({ allergens }: { allergens?: string[] }) => {
  if (!allergens || allergens.length === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      <AlertCircle className="w-3 h-3 text-orange-500" />
      {allergens.map((a) => (
        <span
          key={a}
          className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded"
          style={{ fontSize: "0.625rem", fontWeight: 600 }}
        >
          {a}
        </span>
      ))}
    </div>
  );
};

//Điều phối luồng dữ liệu và sắp xếp các thành phần con.
export const ItemCard = ({
  item,
  index,
  promotions,
  openComboModal,
  openCustomizationModal,
  addToCart,
}: MenuItemCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.03 }}
    whileHover={{ y: -4 }}
    className="bg-card rounded-xl border border-border shadow-lg overflow-hidden h-full flex flex-col"
  >
    <ItemImage item={item} promotions={promotions} />
    <div className="p-4 flex flex-col flex-1">
      <ItemInfo item={item} />
      <ItemAllergens allergens={item.allergens} />
      <ItemFooter
        item={item}
        openComboModal={openComboModal}
        openCustomizationModal={openCustomizationModal}
        addToCart={addToCart}
      />
    </div>
  </motion.div>
);
