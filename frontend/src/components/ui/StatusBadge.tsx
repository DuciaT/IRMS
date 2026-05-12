import type { Bill } from "../../features/billing/types/types";

//Hiển thị trạng thái với màu sắc tương ứng.
export const StatusBadge = ({ status }: { status: Bill["paymentStatus"] }) => {
  const styles = {
    paid: "bg-green-500/10 text-green-500",
    cancelled: "bg-red-500/10 text-red-500",
    pending: "bg-accent/10 text-accent",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full ${styles[status] || styles.pending}`}
      style={{ fontSize: "0.75rem", fontWeight: 600 }}
    >
      {status.toUpperCase()}
    </span>
  );
};
