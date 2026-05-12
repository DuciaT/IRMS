import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface MenuHeaderProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  setCurrentPage: (page: number) => void;
}

//Nhận input từ người dùng và kích hoạt sự thay đổi tìm kiếm.
const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="relative mb-4">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search menu items..."
      className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-lg focus:border-accent focus:outline-none transition-colors"
    />
  </div>
);

//Hiển thị danh sách các nút danh mục và xử lý sự kiện chọn danh mục.
const CategoryFilters = ({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: string[];
  selectedCategory: string;
  onSelect: (cat: string) => void;
}) => (
  <div className="flex gap-2 overflow-x-auto pb-2">
    {categories.map((category) => (
      <motion.button
        key={category}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(category)}
        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
          selectedCategory === category
            ? "bg-primary text-primary-foreground shadow-lg"
            : "bg-muted hover:bg-muted/80"
        }`}
        style={{ fontWeight: 600, fontSize: "0.875rem" }}
      >
        {category}
      </motion.button>
    ))}
  </div>
);

//Container chính, giữ khung Layout và điều phối các thành phần con.
export const MenuHeader = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
}: MenuHeaderProps) => (
  <motion.header
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-card border-2 border-border p-6"
  >
    <h1
      className="mb-4"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "2rem",
        fontWeight: 700,
      }}
    >
      Digital Ordering
    </h1>
    <SearchBar
      value={searchQuery}
      onChange={(val) => {
        setSearchQuery(val);
        setCurrentPage(1);
      }}
    />
    <CategoryFilters
      categories={categories}
      selectedCategory={selectedCategory}
      onSelect={(category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
      }}
    />
  </motion.header>
);
