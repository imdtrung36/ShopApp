const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString("vi-VN") + " đ" : "0 đ");

export default function CartPage({ cart, onInc, onDec, onRemove, onClear }) {
  const total = cart.reduce((s,i)=>s + (i.qty ?? 0)*(i.price ?? 0), 0);

  return (
    <div className="container" style={{ maxWidth: 900, margin:"0 auto", padding: 20 }}>
      <h2>Giỏ hàng</h2>

      {cart.length === 0 ? (
        <p>Chưa có sản phẩm nào.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} style={{ display:"flex", gap:16, borderBottom:"1px solid #eee", padding:"12px 0" }}>
              <img src={item.image} alt={item.name} style={{ width:80, height:80, objectFit:"cover", borderRadius:8 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600 }}>{item.name}</div>
                <div style={{ color:"#666", fontSize:12 }}>{fmt(item.price)} / sp</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
                  <button onClick={() => onDec(item.id)}>−</button>
                  <span>{item.qty ?? 0}</span>
                  <button onClick={() => onInc(item.id)}>＋</button>
                  <div style={{ marginLeft:"auto", fontWeight:600 }}>{fmt((item.qty ?? 0)*(item.price ?? 0))}</div>
                </div>
                <button onClick={() => onRemove(item.id)} style={{ marginTop:6 }}>Xóa</button>
              </div>
            </div>
          ))}

          <div style={{ display:"flex", justifyContent:"space-between", marginTop:16 }}>
            <strong>Tổng tiền:</strong>
            <strong>{fmt(total)}</strong>
          </div>

          <div style={{ marginTop:12, display:"flex", gap:8 }}>
            <button onClick={onClear}>Xóa toàn bộ giỏ</button>
            <button style={{ background:"#4caf50", color:"#fff", border:0, padding:"8px 12px", borderRadius:6 }}>
              Thanh toán (demo)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
