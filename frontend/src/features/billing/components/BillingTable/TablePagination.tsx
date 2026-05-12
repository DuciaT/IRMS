//Điều hướng trang và hiển thị thông tin kết quả.
export const TablePagination = ({
  currentPage,
  totalPages,
  indexOfFirstItem,
  totalItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  totalItems: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
}) => (
  <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-card/50">
    <div className="text-sm text-muted-foreground">
      Showing{" "}
      <span className="font-medium text-foreground">
        {indexOfFirstItem + 1}
      </span>{" "}
      to{" "}
      <span className="font-medium text-foreground">
        {Math.min(indexOfFirstItem + 5, totalItems)}
      </span>{" "}
      results
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <div className="flex gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-10 h-10 text-sm font-medium rounded-lg transition-all ${
              currentPage === i + 1
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  </div>
);
