import { Search } from "lucide-react";

interface OrderHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface OrderSearchProps {
  query: string;
  onSearchChange: (value: string) => void;
}

//Hiển thị phần tiêu đề và mô tả của trang.
const OrderTitle = () => (
  <div>
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.5rem",
        fontWeight: 600,
      }}
    >
      Recent Orders
    </h2>
    <p
      className="text-primary-foreground/80 mt-1"
      style={{ fontSize: "0.875rem" }}
    >
      Real-time order tracking across all locations
    </p>
  </div>
);

//Hiển thị ô nhập liệu và xử lý tương tác tìm kiếm.
const OrderSearch = ({ query, onSearchChange }: OrderSearchProps) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
    <input
      type="text"
      value={query}
      onChange={(e) => onSearchChange(e.target.value)}
      className="pl-10 pr-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg focus:bg-primary-foreground/20 focus:outline-none placeholder:text-primary-foreground/60 text-primary-foreground"
      style={{ fontSize: "0.875rem", width: "300px" }}
      placeholder="Search orders..."
    />
  </div>
);

//Điều phối việc hiển thị các thành phần con.
export const OrderHeader = ({
  searchQuery,
  setSearchQuery,
}: OrderHeaderProps) => {
  return (
    <div className="p-6 border-b border-primary/20 bg-primary/80 text-primary-foreground">
      <div className="flex items-center justify-between mb-4">
        <OrderTitle />

        <OrderSearch query={searchQuery} onSearchChange={setSearchQuery} />
      </div>
    </div>
  );
};
