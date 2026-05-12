import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrderPaginationProps {
  startIndex: number;
  endIndex: number;
  totalFiltered: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

interface NavButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  direction: "left" | "right";
}

//Hiển thị thông tin dải dữ liệu hiện tại.
const PaginationInfo = ({
  start,
  end,
  total,
}: {
  start: number;
  end: number;
  total: number;
}) => (
  <div className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
    Showing {start + 1}-{Math.min(end, total)} of {total} orders
  </div>
);

//Thành phần nút điều hướng.
const NavButton = ({
  onClick,
  disabled,
  children,
  direction,
}: NavButtonProps) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
      disabled
        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
        : "bg-primary text-primary-foreground hover:shadow-lg"
    }`}
    style={{ fontSize: "0.875rem", fontWeight: 600 }}
  >
    {direction === "left" && <ChevronLeft className="w-4 h-4" />}
    {children}
    {direction === "right" && <ChevronRight className="w-4 h-4" />}
  </motion.button>
);

//Hiển thị vị trí trang hiện tại.
const PageIndicator = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <span
    className="px-4 py-2 bg-muted rounded-lg"
    style={{ fontSize: "0.875rem", fontWeight: 600 }}
  >
    Page {current} of {total || 1}
  </span>
);

export const OrderPagination = ({
  startIndex,
  endIndex,
  totalFiltered,
  currentPage,
  totalPages,
  setCurrentPage,
}: OrderPaginationProps) => {
  return (
    <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
      {/* Phần hiển thị thông tin */}
      <PaginationInfo start={startIndex} end={endIndex} total={totalFiltered} />

      {/* Phần điều hướng */}
      <div className="flex items-center gap-2">
        <NavButton
          direction="left"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </NavButton>

        <PageIndicator current={currentPage} total={totalPages} />

        <NavButton
          direction="right"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </NavButton>
      </div>
    </div>
  );
};
