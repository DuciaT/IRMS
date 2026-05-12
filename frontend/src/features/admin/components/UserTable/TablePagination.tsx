import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UserTableProps } from "./UserTable";

//logic hiển thị số trang, các nút Next/Prev và thông tin số lượng bản ghi
export const TablePagination = ({
  filteredUsers,
  startIndex,
  itemsPerPage,
  currentPage,
  totalPages,
  setCurrentPage,
}: Pick<
  UserTableProps,
  | "filteredUsers"
  | "startIndex"
  | "itemsPerPage"
  | "currentPage"
  | "totalPages"
  | "setCurrentPage"
>) => (
  <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
    <p className="text-sm text-muted-foreground">
      Showing{" "}
      <span className="font-medium text-foreground">
        {filteredUsers.length === 0 ? 0 : startIndex + 1}
      </span>
      {" - "}
      <span className="font-medium text-foreground">
        {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
      </span>
      {" of "}
      <span className="font-medium text-foreground">
        {filteredUsers.length}
      </span>{" "}
      entries
    </p>
    <div className="flex items-center gap-1">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => (prev as number) - 1)}
        className="p-2 rounded-lg hover:bg-card border border-transparent hover:border-border disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-1 mx-2">
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={i}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                currentPage === pageNum
                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                  : "hover:bg-card text-muted-foreground border border-transparent hover:border-border"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
      <button
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage((prev) => (prev as number) + 1)}
        className="p-2 rounded-lg hover:bg-card border border-transparent hover:border-border disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </div>
);
