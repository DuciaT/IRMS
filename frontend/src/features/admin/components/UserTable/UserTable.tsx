import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { type User } from "../../types/types";
import { UserTableRow } from "../UserTableRow/UserTableRow";
import { TableSearchBar } from "./TableSearchBar";
import { TablePagination } from "./TablePagination";

export interface UserTableProps {
  filteredUsers: User[];
  paginatedUsers: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  emptyRows: number;
  onOpenAddModal: () => void;
  onOpenEditModal: (user: User) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

//Hiển thị giao diện khi kết quả tìm kiếm trống
const EmptyState = () => (
  <tr className="border-none">
    <td colSpan={7} className="p-0">
      <div className="flex flex-col items-center justify-center py-24 w-full">
        <div className="bg-muted/20 p-6 rounded-full mb-4">
          <Search className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <p className="text-xl font-semibold text-muted-foreground">
          No users found
        </p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Try adjusting your search criteria
        </p>
      </div>
    </td>
  </tr>
);

//Thành phần điều phối (Orchestrator)
export const UserTable = (props: UserTableProps) => {
  const {
    paginatedUsers,
    currentPage,
    emptyRows,
    onOpenEditModal,
    onToggleStatus,
    onDelete,
  } = props;

  // Variants cho hiệu ứng chuyển trang
  const tableVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border/60 shadow-xl shadow-black/5 overflow-hidden"
    >
      <TableSearchBar {...props} />

      {/* --- Table Body Section --- */}
      <div className="overflow-x-auto relative min-h-[430px]">
        <table className="w-full border-collapse">
          <thead className="bg-muted/30">
            <tr>
              {["User ID", "Name", "Contact", "Role", "Location"].map(
                (header) => (
                  <th
                    key={header}
                    className="text-left p-4 text-sm font-semibold text-foreground/80 border-b border-border/50"
                  >
                    {header}
                  </th>
                ),
              )}
              <th
                className="text-left p-4 w-32"
                style={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                Status
              </th>
              <th
                className="text-left p-4 w-28"
                style={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.tr
                key={currentPage}
                variants={tableVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="contents"
              >
                {paginatedUsers.length > 0 ? (
                  <>
                    {paginatedUsers.map((user) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                        onEdit={onOpenEditModal}
                        onToggleStatus={onToggleStatus}
                        onDelete={onDelete}
                      />
                    ))}

                    {/* Render các dòng trống để giữ chiều cao bảng ổn định */}
                    {emptyRows > 0 &&
                      [...Array(emptyRows)].map((_, i) => (
                        <tr
                          key={`empty-${i}`}
                          className="border-b border-border/20 h-[73px]"
                        >
                          <td colSpan={7} className="p-4">
                            &nbsp;
                          </td>
                        </tr>
                      ))}
                  </>
                ) : (
                  <EmptyState />
                )}
              </motion.tr>
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <TablePagination {...props} />
    </motion.div>
  );
};
