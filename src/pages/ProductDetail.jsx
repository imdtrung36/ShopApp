import { useParams, useNavigate } from "react-router-dom";
import productsData from "../data/products";

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const nav = useNavigate();
  const product = productsData.find(p => String(p.id) === id);

  if (!product) {
    return (
      <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <p>Không tìm thấy sản phẩm.</p>
        <button onClick={() => nav("/")}>Về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 900, margin: "0 auto", padding: 20, display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
      <img src={product.image} alt={product.name} style={{width:"100%", borderRadius:8, objectFit:"cover"}} />
      <div>
        <h2>{product.name}</h2>
        <p style={{ color:"#666" }}>{product.category}</p>
        <h3 style={{ margin: "8px 0" }}>{product.price.toLocaleString("vi-VN")} đ</h3>
        <p>{product.description}</p>
        <div style={{ marginTop: 16 }}>
          <button onClick={() => onAddToCart(product)} style={{ background:"#28a745", color:"#fff", border:0, padding:"10px 16px", borderRadius:6 }}>
            Thêm vào giỏ
          </button>
          <button onClick={() => nav(-1)} style={{ marginLeft: 10 }}>Quay lại</button>
        </div>
      </div>
    </div>
  );
}
