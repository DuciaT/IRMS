import { type MenuItem } from "../../types/MMtypes";

//Hiển thị phần hình ảnh và các nhãn trạng thái (Stock, Combo, Promo badge).
export const CardVisuals = ({
  item,
  activePromo,
}: {
  item: MenuItem;
  activePromo: any;
}) => (
  <div className="h-52 bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
    {item.image ? (
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover"
      />
    ) : (
      <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}>
        🍽️
      </span>
    )}

    <div
      className={`absolute top-2 right-2 px-2 py-1 text-white rounded font-semibold text-[0.65rem] ${
        item.available ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {item.available ? "IN STOCK" : "OUT OF STOCK"}
    </div>

    {item.isCombo && (
      <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground rounded font-semibold text-[0.65rem]">
        COMBO
      </div>
    )}

    {activePromo && (
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-yellow-500 text-white rounded font-semibold text-[0.65rem]">
        🎉 PROMO
      </div>
    )}
  </div>
);
