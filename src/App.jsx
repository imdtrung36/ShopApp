// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import axios from "axios";

import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import MiniCart from "./components/MiniCart";
import Checkout from "./pages/Checkout";

import useDebouncedValue from "./hooks/useDebouncedValue";
import "./styles/App.css";

// ===== Helpers =====
const LS_KEY = "cart_v1";
const safeParse = (raw) => { try { const d = JSON.parse(raw); return Array.isArray(d) ? d : []; } catch { return []; } };

// Chuẩn hoá text để search không phân biệt dấu/hoa thường
const norm = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();

// Ép giá về number (nếu API trả string)
const num = (v) => {
  if (typeof v === "number") return v;
  if (!v) return 0;
  return Number(String(v).replace(/[^\d.-]/g, "")) || 0;
};

// ===== Hook filters + đồng bộ URL =====
function useFiltersWithURL() {
  const [sp, setSp] = useSearchParams();

  const [search, setSearch] = useState(sp.get("q") ?? "");
  const [category, setCategory] = useState(sp.get("cat") ?? "");
  const [minPrice, setMinPrice] = useState(sp.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(sp.get("max") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "");
  const [page, setPage] = useState(Number(sp.get("page") ?? 1));

  const debSearch = useDebouncedValue(search, 300);

  // Mỗi khi đổi tiêu chí, về trang 1
  useEffect(() => { setPage(1); }, [search, category, minPrice, maxPrice, sort]);

  // Ghi ngược ra URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debSearch) params.set("q", debSearch);
    if (category) params.set("cat", category);
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);
    if (sort) params.set("sort", sort);
    if (page !== 1) params.set("page", String(page));
    setSp(params, { replace: true });
  }, [debSearch, category, minPrice, maxPrice, sort, page, setSp]);

  return {
    search, setSearch,
    category, setCategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    sort, setSort,
    page, setPage,
  };
}

// ===== App =====
export default function App() {
  // Cart
  const [cart, setCart] = useState(() => safeParse(localStorage.getItem(LS_KEY)));
  const [showCart, setShowCart] = useState(false);

  // Products từ API
  const [productsData, setProductsData] = useState([]);

  // Fetch dữ liệu sản phẩm (khuyên dùng proxy Vite: axios.get('/api/products'))
  useEffect(() => {
    axios.get("/api/products")
      .then(res => setProductsData(res.data))
      .catch(err => console.error("Fetch products error:", err));
  }, []);

  // Đồng bộ cart với localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch { }
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }, [cart]);

  // Cart helpers
  const AddToCart = (product) => {
    setCart((prev) => {
      const i = prev.findIndex((p) => p.id === product.id);
      if (i !== -1) {
        const next = [...prev];
        next[i] = { ...next[i], qty: (next[i].qty || 0) + 1 };
        return next;
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const Inc = (id) => setCart((prev) => prev.map((p) => p.id === id ? { ...p, qty: (p.qty || 0) + 1 } : p));
  const Dec = (id) => setCart((prev) => prev
    .map((p) => p.id === id ? { ...p, qty: (p.qty || 0) - 1 } : p)
    .filter((p) => (p.qty || 0) > 0)
  );
  const Remove = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const Clear = () => setCart([]);
  const totalQty = cart.reduce((s, i) => s + (i.qty ?? 0), 0);

  // Filters + URL
  const filters = useFiltersWithURL();
  const { search, category, minPrice, maxPrice, sort, page } = filters;

  // Lọc + sort + khoảng giá
  const filteredProducts = useMemo(() => {
    let list = [...productsData];

    // Search theo tên (không phân biệt dấu)
    if (search.trim()) {
      const q = norm(search);
      list = list.filter((p) => norm(p.name).includes(q));
    }

    // Category
    const cat = (category || "").toLowerCase();
    if (cat) list = list.filter((p) => (p.category || "").toLowerCase() === cat);

    // Price range
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    list = list.filter((p) => num(p.price) >= min && num(p.price) <= max);

    // Sort key (nếu Toolbar dùng label TV thì map về key chuẩn ở đây)
    const sortKey = ({
      "Giá ↑": "price-asc",
      "Giá ↓": "price-desc",
      "Tên A-Z": "name-asc",
      "Tên Z-A": "name-desc",
    }[sort] || sort);

    // Sort
    if (sortKey === "price-asc") list.sort((a, b) => num(a.price) - num(b.price));
    if (sortKey === "price-desc") list.sort((a, b) => num(b.price) - num(a.price));
    if (sortKey === "name-asc") list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    if (sortKey === "name-desc") list.sort((a, b) => String(b.name).localeCompare(String(a.name)));

    return list;
  }, [productsData, search, category, minPrice, maxPrice, sort]);

  // Lấy danh mục động từ dữ liệu
  const categories = useMemo(() => {
    const set = new Set(
      productsData.map(p => String(p.category || "").trim())
    );
    return Array.from(set).filter(Boolean); // ["Áo","Quần","Giày"] hoặc bất kỳ
  }, [productsData]);

  // Phân trang
  const PAGE_SIZE = 6;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageSlice = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (page !== currentPage) filters.setPage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  return (
    <div>
      <Header cartCount={totalQty} onCartClick={() => setShowCart(true)} />

      {/* MiniCart overlay */}
      {showCart && (
        <MiniCart
          cart={cart}
          onClose={() => setShowCart(false)}
          onInc={Inc}
          onDec={Dec}
          onRemove={Remove}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home products={pageSlice} onAddToCart={AddToCart}>
              {/* Toolbar + Pagination đặt ở phần children của Home */}
              <Toolbar {...filters} categories={categories}/>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button
                  style={{ padding: "6px 12px", borderRadius: 20, background: "#1976d2", color: "#fff", border: "none", opacity: currentPage === 1 ? 0.6 : 1 }}
                  disabled={currentPage === 1}
                  onClick={() => filters.setPage(currentPage - 1)}
                >
                  « Trước
                </button>
                <span>Trang {currentPage}/{totalPages}</span>
                <button
                  style={{ padding: "6px 12px", borderRadius: 20, background: "#1976d2", color: "#fff", border: "none", opacity: currentPage === totalPages ? 0.6 : 1 }}
                  disabled={currentPage === totalPages}
                  onClick={() => filters.setPage(currentPage + 1)}
                >
                  Sau »
                </button>
              </div>
            </Home>
          }
        />
        <Route path="/product/:id" element={<ProductDetail onAddToCart={AddToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} onInc={Inc} onDec={Dec} onRemove={Remove} onClear={Clear} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<div style={{ padding: 20 }}>404 - Không tìm thấy trang</div>} />
      </Routes>
    </div>
  );
}
