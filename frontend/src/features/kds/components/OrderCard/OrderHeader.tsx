import { Clock, AlertTriangle } from "lucide-react";

//Hiển thị thông tin chung của order như số bàn, thời gian đã trôi qua, và ID đơn hàng.
export const OrderHeader = ({
  tableNumber,
  elapsedTime,
  orderId,
  overdue,
  nearDeadline,
}: {
  tableNumber: string;
  elapsedTime: string;
  orderId: string;
  overdue: boolean;
  nearDeadline: boolean;
}) => (
  <>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          {tableNumber}
        </span>
        {overdue && <AlertTriangle className="w-5 h-5 text-red-600" />}
        {nearDeadline && !overdue && (
          <Clock className="w-5 h-5 text-orange-600" />
        )}
      </div>
      <div className="flex items-center gap-2 pr-8">
        <Clock className="w-4 h-4" />
        <span style={{ fontWeight: 700 }}>{elapsedTime}</span>
      </div>
    </div>
    <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
      Order #{orderId}
    </p>
  </>
);
