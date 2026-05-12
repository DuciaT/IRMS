import { motion } from "framer-motion";
import { type Order, type StatusConfig } from "../../types/ROtypes";
import { TextCell } from "../../../../components/ui/TextCell";

interface OrderRowProps {
  order: Order;
  index: number;
  statusConfig: StatusConfig;
}

//Hiển thị ID đơn hàng.
const OrderIDCell = ({ id }: { id: string }) => (
  <td className="p-4">
    <span
      className="text-foreground"
      style={{ fontSize: "0.875rem", fontWeight: 600 }}
    >
      {id}
    </span>
  </td>
);

//Logic hiển thị Avatar (lấy chữ cái đầu) và tên khách hàng.
const CustomerCell = ({ name }: { name: string }) => (
  <td className="p-4">
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white"
        style={{ fontSize: "0.75rem", fontWeight: 600 }}
      >
        {name.charAt(0)}
      </div>
      <span className="text-foreground" style={{ fontSize: "0.875rem" }}>
        {name}
      </span>
    </div>
  </td>
);

//Hiển thị trạng thái, icon và màu sắc dựa trên statusConfig. Tách biệt logic màu sắc khỏi cấu trúc bảng.
const StatusBadgeCell = ({
  status,
  config,
}: {
  status: Order["status"];
  config: StatusConfig;
}) => {
  const currentStatus = config[status];
  const StatusIcon = currentStatus.icon;

  return (
    <td className="p-4">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${currentStatus.color}`}
      >
        <StatusIcon className="w-3.5 h-3.5" />
        <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>
          {currentStatus.label}
        </span>
      </div>
    </td>
  );
};

export const OrderRow = ({ order, index, statusConfig }: OrderRowProps) => {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="border-b border-border hover:bg-muted/20 transition-colors group"
    >
      <OrderIDCell id={order.id} />

      <CustomerCell name={order.customer} />

      <TextCell value={order.location} className="text-muted-foreground" />

      <TextCell value={`${order.items} items`} />

      <TextCell value={order.total} isDisplayFont={true} />

      <StatusBadgeCell status={order.status} config={statusConfig} />

      <TextCell value={order.time} className="text-muted-foreground" />
    </motion.tr>
  );
};
