import { motion } from "framer-motion";
import { Mail, Phone, Building } from "lucide-react";
import { type User, roleConfig } from "../../types/types";
import { UserActions } from "./UserActions";

export interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

//Hiển thị khối hình ảnh đại diện (avatar) dựa trên tên người dùng.
const UserAvatar = ({ name }: { name: string }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white"
      style={{ fontSize: "0.875rem", fontWeight: 600 }}
    >
      {name.charAt(0)}
    </div>
    <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{name}</span>
  </div>
);

//Hiển thị các thông tin liên lạc (Email, Phone) kèm Icon
const UserInfo = ({ email, phone }: { email: string; phone: string }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Mail className="w-3 h-3" />
      <span style={{ fontSize: "0.75rem" }}>{email}</span>
    </div>
    <div className="flex items-center gap-2 text-muted-foreground">
      <Phone className="w-3 h-3" />
      <span style={{ fontSize: "0.75rem" }}>{phone}</span>
    </div>
  </div>
);

//Xử lý màu sắc và định dạng văn bản cho trạng thái (Active/Inactive) và Vai trò (Role)
const StatusBadge = ({
  label,
  className,
  uppercase = false,
}: {
  label: string;
  className: string;
  uppercase?: boolean;
}) => (
  <span
    className={`px-3 py-1 rounded-full ${className}`}
    style={{ fontSize: "0.75rem", fontWeight: 600 }}
  >
    {uppercase ? label.toUpperCase() : label}
  </span>
);

//sắp xếp bố cục bảng và truyền dữ liệu xuống các component con
export const UserTableRow = (props: UserTableRowProps) => {
  const { user } = props;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group border-b border-border/40 hover:bg-muted/30 transition-colors"
    >
      <td className="p-4" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
        {user.id}
      </td>
      <td className="p-4">
        <UserAvatar name={user.name} />
      </td>
      <td className="p-4">
        <UserInfo email={user.email} phone={user.phone} />
      </td>
      <td className="p-4">
        <StatusBadge
          label={roleConfig[user.role].label}
          className={roleConfig[user.role].color}
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span style={{ fontSize: "0.875rem" }}>{user.location}</span>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full ${
            user.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
          style={{ fontSize: "0.75rem", fontWeight: 600 }}
        >
          {user.status.toUpperCase()}
        </span>
      </td>
      <td className="p-4">
        <UserActions {...props} />
      </td>
    </motion.tr>
  );
};
