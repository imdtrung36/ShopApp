const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString("vi-VN") + " đ" : "0 đ");

export default function Cart({
  cart = [],
  totalPrice = 0,
  onClose = () => {},
  onInc = () => {},
  onDec = () => {},
  onRemove = () => {},
  onClear = () => {},
}) {
  const safeCart = Array.isArray(cart) ? cart : [];

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.35)",
      display:"flex", justifyContent:"flex-end", zIndex:50
    }}>
      <div style={{
        width: 380, height: "100%", background:"#fff",
        borderLeft:"1px solid #ddd", boxShadow:"-2px 0 10px rgba(0,0,0,.1)",
        display:"flex", flexDirection:"column"
      }}>
        <div style={{padding:16, borderBottom:"1px solid #eee", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h3 style={{margin:0}}>🛒 Giỏ hàng</h3>
          <button onClick={onClose} style={{background:"#f44336",color:"#fff",border:0,padding:"6px 10px",borderRadius:6}}>
            Đóng
          </button>
        </div>

        <div style={{padding:16, overflowY:"auto", flex:1}}>
          {safeCart.length === 0 ? (
            <p>Chưa có sản phẩm nào.</p>
          ) : (
            safeCart.map((item) => (
              <div key={item.id} style={{display:"flex",gap:12, borderBottom:"1px solid #f2f2f2", padding:"12px 0"}}>
                <img src={item.image} alt={item.name} style={{width:64, height:64, objectFit:"cover", borderRadius:6}} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600}}>{item.name}</div>
                  <div style={{fontSize:12, color:"#666"}}>{fmt(item.price)} / sp</div>

                  <div style={{display:"flex", alignItems:"center", gap:8, marginTop:8}}>
                    <button onClick={() => onDec(item.id)} style={{padding:"2px 8px"}}>−</button>
                    <span>{item.qty ?? 0}</span>
                    <button onClick={() => onInc(item.id)} style={{padding:"2px 8px"}}>＋</button>

                    <div style={{marginLeft:"auto", fontWeight:600}}>
                      {fmt((item.qty ?? 0) * (item.price ?? 0))}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                    style={{marginTop:6, background:"#ff9800", border:0, color:"#fff", padding:"4px 8px", borderRadius:4}}
                  >
                    Xóa dòng này
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{padding:16, borderTop:"1px solid #eee"}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
            <strong>Tổng tiền:</strong>
            <strong>{fmt(totalPrice)}</strong>
          </div>
          <div style={{display:"flex", gap:8}}>
            <button onClick={onClear} style={{flex:1, background:"#9e9e9e", color:"#fff", border:0, padding:"10px 12px", borderRadius:6}}>
              Xóa toàn bộ giỏ
            </button>
            <button disabled={safeCart.length === 0} style={{flex:1, background:"#4caf50", color:"#fff", border:0, padding:"10px 12px", borderRadius:6}}>
              Thanh toán (demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
