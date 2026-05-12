import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface NavButtonProps {
  isDisabled: boolean;
  onClick: () => void;
  Icon: React.ElementType;
}

interface PageIndicatorProps {
  pageNumber: number;
  isActive: boolean;
  onClick: () => void;
}

//Thành phần nút điều hướng (Previous/Next)
const NavButton = ({ isDisabled, onClick, Icon }: NavButtonProps) => (
  <button
    disabled={isDisabled}
    onClick={onClick}
    className="p-2 rounded-full hover:bg-muted disabled:opacity-30 transition-colors"
  >
    <Icon className="w-6 h-6" />
  </button>
);

//Thành phần hiển thị ô số trang cụ thể
const PageIndicator = ({
  pageNumber,
  isActive,
  onClick,
}: PageIndicatorProps) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
      isActive
        ? "bg-primary text-primary-foreground shadow-md"
        : "hover:bg-muted text-muted-foreground"
    }`}
  >
    {pageNumber}
  </button>
);

//bộ khung điều phối (Orchestrator).
export default function MenuPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 pt-6 border-t border-border">
      {/* Nút điều hướng lùi */}
      <NavButton
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        Icon={ChevronLeft}
      />

      {/* Danh sách các trang số */}
      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <PageIndicator
              key={pageNum}
              pageNumber={pageNum}
              isActive={currentPage === pageNum}
              onClick={() => onPageChange(pageNum)}
            />
          );
        })}
      </div>

      {/* Nút điều hướng tiến */}
      <NavButton
        isDisabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        Icon={ChevronRight}
      />
    </div>
  );
}
