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

// ---- Cart Controller (localStorage) ----
import {
  getCartFromStorage,
  saveCartToStorage,
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "./controllers/cartController";

// helper: bỏ dấu để so sánh tên không phân biệt dấu
const norm = (s = "") =>
  s.toString().toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();

// helper: ép price về number an toàn
const num = (v) => (typeof v === "number" ? v : Number(String(v || 0).replace(/[^\d.-]/g, "")) || 0);

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

  useEffect(() => { setPage(1); }, [search, category, minPrice, maxPrice, sort]);

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
  // Cart (dùng controller)
  const [cart, setCart] = useState(() => getCartFromStorage());
  const [showCart, setShowCart] = useState(false);

  // Đồng bộ cart vào localStorage mỗi khi thay đổi
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Các hàm thao tác cart
  const AddToCart = (product) => setCart((prev) => addToCart(prev, product));
  const Inc = (id) => setCart((prev) => increaseQty(prev, id));
  const Dec = (id) => setCart((prev) => decreaseQty(prev, id));
  const Remove = (id) => setCart((prev) => removeFromCart(prev, id));
  const Clear = () => setCart(clearCart());

  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  // Products từ API
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    axios.get("/api/products")
      .then((res) => setProductsData(res.data))
      .catch((err) => console.error("Fetch products error:", err));
  }, []);


  // Filters + URL
  const filters = useFiltersWithURL();
  const { search, category, minPrice, maxPrice, sort, page } = filters;

  // Lọc + sort + khoảng giá
  // 
  const filteredProducts = useMemo(() => {
    let list = [...productsData];

    // Search theo tên (không dấu)
    if (search.trim()) {
      const q = norm(search);
      list = list.filter(p => norm(p.name).includes(q));
    }

    // Category
    const cat = (category || "").toLowerCase();
    if (cat) list = list.filter(p => (p.category || "").toLowerCase() === cat);

    // Price range
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    list = list.filter(p => num(p.price) >= min && num(p.price) <= max);

    // Map sort label nếu lỡ truyền nhãn TV
    const sortKey = ({
      "Giá ↑": "price-asc",
      "Giá ↓": "price-desc",
      "Tên A-Z": "name-asc",
      "Tên Z-A": "name-desc",
    }[sort] || sort);

    // SORT – giá và tên (không dấu)
    if (sortKey === "price-asc") list.sort((a, b) => num(a.price) - num(b.price));
    if (sortKey === "price-desc") list.sort((a, b) => num(b.price) - num(a.price));
    
    const viCmp = (x = "", y = "") => x.localeCompare(y, "vi", { sensitivity: "base" });
    if (sortKey === "name-asc") list.sort((a, b) => viCmp(a.name, b.name));
    if (sortKey === "name-desc") list.sort((a, b) => viCmp(b.name, a.name));


    return list;
  }, [productsData, search, category, minPrice, maxPrice, sort]);

  // Lấy danh mục động
  const categories = useMemo(() => {
    const set = new Set(productsData.map((p) => String(p.category || "").trim()));
    return Array.from(set).filter(Boolean);
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
              <Toolbar {...filters} categories={categories} />
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
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    opacity: currentPage === 1 ? 0.6 : 1,
                  }}
                  disabled={currentPage === 1}
                  onClick={() => filters.setPage(currentPage - 1)}
                >
                  « Trước
                </button>
                <span>Trang {currentPage}/{totalPages}</span>
                <button
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    opacity: currentPage === totalPages ? 0.6 : 1,
                  }}
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
