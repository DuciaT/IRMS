import { type OrderItemType, type OrderStatus } from "../../types/types";
import { ItemActions } from "./ItemActions";

export interface OrderItemProps {
  item: OrderItemType;
  orderId: string;
  isReadOnly: boolean;
  onUpdateStatus: (
    orderId: string,
    itemId: string,
    status: OrderStatus,
  ) => void;
}

const STATUS_CONFIG: Record<OrderStatus, { color: string; label: string }> = {
  new: { color: "bg-blue-500", label: "New" },
  cooking: { color: "bg-orange-500", label: "Cooking" },
  ready: { color: "bg-green-500", label: "Ready to Serve" },
  served: { color: "bg-gray-500", label: "Served" },
  cancelled: { color: "bg-red-500", label: "Cancelled" },
};

//Hiển thị nhãn trạng thái với màu tương ứng
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = STATUS_CONFIG[status];
  return (
    <div
      className={`px-2 py-1 ${config.color} text-white rounded`}
      style={{ fontSize: "0.625rem", fontWeight: 700 }}
    >
      {config.label}
    </div>
  );
};

//Hiển thị thông tin sản phẩm (tên, số lượng, ghi chú).
const ItemDetails = ({
  quantity,
  name,
  notes,
}: {
  quantity: number;
  name: string;
  notes?: string;
}) => (
  <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
      <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
        {quantity}x {name}
      </span>
    </div>
    {notes && (
      <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
        📝 {notes}
      </p>
    )}
  </div>
);

//Thành phần điều phối (Orchestrator)
export const OrderItem = ({
  item,
  orderId,
  isReadOnly,
  onUpdateStatus,
}: OrderItemProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-3 border border-border">
      <div className="flex items-start justify-between mb-2">
        <ItemDetails
          quantity={item.quantity}
          name={item.menuItemName}
          notes={item.notes}
        />
        <StatusBadge status={item.status} />
      </div>

      {!isReadOnly && (
        <ItemActions
          item={item}
          orderId={orderId}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </div>
  );
};
