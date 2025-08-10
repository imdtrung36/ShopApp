export default function Header({ cartCount, onCartClick }) {
  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      background: "#1976d2",
      color: "#fff"
    }}>
      <h1>36 Store</h1>
      <button
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "16px"
        }}
        onClick={onCartClick}
      >
        🛒 Giỏ hàng ({cartCount})
      </button>
    </header>
  );
}
