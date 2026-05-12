import type { Bill } from "../../../../features/billing/types/types";

//Hiển thị thông tin hóa đơn và danh sách sản phẩm.
export const BillDetails = ({
  selectedBill,
  total,
}: {
  selectedBill: Bill;
  total: number;
}) => (
  <div className="bg-muted/30 rounded-xl p-4">
    <div className="flex justify-between items-center mb-4">
      <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
        Table: {selectedBill.tableId}
      </span>
      <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
        ID: {selectedBill.id}
      </span>
    </div>
    <div className="space-y-2 mb-4">
      {selectedBill.items.map((item, index) => (
        <div key={index} className="flex justify-between">
          <span style={{ fontSize: "0.875rem" }}>
            {item.quantity}x {item.name}
          </span>
          <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
            ${item.total.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
    <div className="border-t border-border pt-3">
      <div className="flex justify-between pt-2">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 700,
          }}
        >
          Total
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 700,
          }}
          className="text-primary"
        >
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);
