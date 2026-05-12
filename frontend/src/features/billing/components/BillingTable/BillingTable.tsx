import { motion } from "framer-motion";

import { type Bill } from "../../types/types";
import { BillTableRow } from "./BillTableRow";
import { TablePagination } from "./TablePagination";

interface BillingTableProps {
  bills: Bill[];
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  onProcess: (bill: Bill) => void;
  onRefund: (bill: Bill) => void;
  onPrint: (bill: Bill) => void;
}

//Hiển thị phần tiêu đề (Title) và mô tả của bảng.
const BillingTableHeader = () => (
  <div className="p-6 border-b border-primary/20 bg-primary/80 text-primary-foreground">
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.5rem",
        fontWeight: 600,
      }}
    >
      Active Bills
    </h2>
    <p
      className="text-primary-foreground/80 mt-1"
      style={{ fontSize: "0.875rem" }}
    >
      Process payments, refunds, and manage billing
    </p>
  </div>
);

//Hiển thị hàng tiêu đề (<thead>) của bảng dữ liệu.
const TableHead = () => (
  <thead className="border-b border-border bg-muted/30">
    <tr>
      {[
        "Bill ID",
        "Customer",
        "Table",
        "Items",
        "Total",
        "Status",
        "Actions",
      ].map((h) => (
        <th
          key={h}
          className="text-left p-4"
          style={{ fontSize: "0.875rem", fontWeight: 600 }}
        >
          {h}
        </th>
      ))}
    </tr>
  </thead>
);
//Khung chứa (Wrapper), quản lý cấu trúc tổng thể và hiệu ứng animation chính.
export const BillingTable = ({
  bills,
  currentPage,
  totalPages,
  indexOfFirstItem,
  onPageChange,
  onProcess,
  onRefund,
  onPrint,
}: BillingTableProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-card rounded-xl border border-border shadow-lg overflow-hidden"
  >
    <BillingTableHeader />
    <div className="overflow-x-auto">
      <table className="w-full">
        <TableHead />
        <tbody>
          {bills.map((bill, index) => (
            <BillTableRow
              key={bill.id}
              bill={bill}
              index={index}
              onProcess={onProcess}
              onRefund={onRefund}
              onPrint={onPrint}
            />
          ))}
        </tbody>
      </table>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstItem={indexOfFirstItem}
        totalItems={bills.length * totalPages}
        onPageChange={onPageChange}
      />
    </div>
  </motion.div>
);
