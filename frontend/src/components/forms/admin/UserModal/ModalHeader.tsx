//hiển thị tiêu đề và mô tả của Modal dựa trên trạng thái đang chỉnh sửa hay thêm mới
export const ModalHeader = ({ isEditing }: { isEditing: boolean }) => (
  <div className="bg-linear-to-r from-primary to-primary/80 p-6">
    <h2
      className="text-primary-foreground"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.5rem",
        fontWeight: 600,
      }}
    >
      {isEditing ? "Edit User" : "Add New User"}
    </h2>
    <p
      className="text-primary-foreground/80 mt-1"
      style={{ fontSize: "0.875rem" }}
    >
      {isEditing ? "Update user information" : "Create a new system user"}
    </p>
  </div>
);
