export default function Checkout() {
  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Thanh toán</h2>
      <form>
        <input placeholder="Họ tên" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
        <input placeholder="Số điện thoại" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
        <input placeholder="Địa chỉ" style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
        <button style={{
          width: "100%",
          padding: "10px",
          background: "#1976d2",
          color: "#fff",
          border: "none"
        }}>Đặt hàng</button>
      </form>
    </div>
  );
}
