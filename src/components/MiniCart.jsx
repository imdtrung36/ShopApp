export default function MiniCart({ cart, onClose, onInc, onDec, onRemove }) {
  const totalPrice = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: "320px",
      height: "100%",
      background: "#fff",
      boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
      zIndex: 1000
    }}>
      <div style={{
        padding: "10px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <strong>Giỏ hàng</strong>
        <button onClick={onClose}>✖</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {cart.length === 0 && <p>Giỏ hàng trống</p>}
        {cart.map(p => (
          <div key={p.id} style={{ marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <div><strong>{p.name}</strong></div>
            <div>{p.price.toLocaleString()} đ</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <button onClick={() => onDec(p.id)}>-</button>
              {p.qty}
              <button onClick={() => onInc(p.id)}>+</button>
              <button onClick={() => onRemove(p.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px", borderTop: "1px solid #ddd" }}>
        <div><strong>Tổng:</strong> {totalPrice.toLocaleString()} đ</div>
        <button
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "8px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}
