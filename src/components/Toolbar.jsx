export default function Toolbar({
  search, setSearch,
  category, setCategory,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  sort, setSort,
  categories = [], 
}) {
  // helper: chỉ cho nhập số, cho phép rỗng
  const onlyDigits = (v) => v.replace(/[^\d]/g, "");

  const clearAll = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
        gap: 10,
        margin: "16px 0",
        alignItems: "center",
      }}
    >
      {/* Search by name */}
      <input
        placeholder="Tìm theo tên..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Tìm theo tên"
      />

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Danh mục"
      >
        <option value="">Tất cả danh mục</option>
        <option value="shirt">Áo</option>
        <option value="pants">Quần</option>
        <option value="shoes">Giày</option>
      </select>

      {/* Price from */}
      <input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        placeholder="Giá từ"
        value={minPrice}
        onChange={(e) => setMinPrice(onlyDigits(e.target.value))}
        aria-label="Giá từ"
      />

      {/* Price to */}
      <input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        placeholder="Giá đến"
        value={maxPrice}
        onChange={(e) => setMaxPrice(onlyDigits(e.target.value))}
        aria-label="Giá đến"
      />

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        aria-label="Sắp xếp"
      >
        <option value="">Sắp xếp</option>
        <option value="price-asc">Giá ↑</option>
        <option value="price-desc">Giá ↓</option>
        <option value="name-asc">Tên A→Z</option>
        <option value="name-desc">Tên Z→A</option>
        <option value="category-asc">Loại A→Z</option>
        <option value="category-desc">Loại Z→A</option>
      </select>

      {/* Clear filters */}
      <button
        onClick={clearAll}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Xóa lọc
      </button>
    </div>
  );
}
