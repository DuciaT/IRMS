import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

interface NavButtonProps {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

interface PageNumberProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

//Hiển thị nút điều hướng "Previous" và "Next". Nó đóng gói logic về trạng thái disabled và styles tương ứng.
const NavButton = ({
  direction,
  disabled,
  onClick,
  children,
}: NavButtonProps) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
      disabled
        ? "bg-muted text-muted-foreground cursor-not-allowed"
        : "bg-primary text-primary-foreground hover:shadow-lg"
    }`}
    style={{ fontWeight: 600, fontSize: "0.875rem" }}
  >
    {direction === "left" && <ChevronLeft className="w-4 h-4" />}
    {children}
    {direction === "right" && <ChevronRight className="w-4 h-4" />}
  </motion.button>
);

//Hiển thị từng ô số trang cụ thể. Nó tự quản lý logic hiển thị dựa trên trạng thái active (trang hiện tại).
const PageNumber = ({ page, isActive, onClick }: PageNumberProps) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`w-10 h-10 rounded-lg ${
      isActive
        ? "bg-primary text-primary-foreground shadow-lg"
        : "bg-muted hover:bg-muted/80"
    }`}
    style={{ fontWeight: 600 }}
  >
    {page}
  </motion.button>
);

//Bộ khung (Orchestrator), quản lý bố cục tổng thể và truyền dữ liệu xuống các sub-components.
export const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) => {
  const handlePrev = () => setCurrentPage(Math.max(1, currentPage - 1));
  const handleNext = () =>
    setCurrentPage(Math.min(totalPages, currentPage + 1));

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {/* Nút Previous */}
      <NavButton
        direction="left"
        disabled={currentPage === 1}
        onClick={handlePrev}
      >
        Previous
      </NavButton>

      {/* Danh sách số trang */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PageNumber
            key={page}
            page={page}
            isActive={currentPage === page}
            onClick={() => setCurrentPage(page)}
          />
        ))}
      </div>

      {/* Nút Next */}
      <NavButton
        direction="right"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        Next
      </NavButton>
    </div>
  );
};
