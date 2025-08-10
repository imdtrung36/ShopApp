import { Link } from "react-router-dom";

export default function ProductItem({ product, onAddToCart }) {
  return (
    <div className="product-item">
      <Link to={`/product/${product.id}`} style={{ textDecoration:"none", color:"inherit" }}>
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
      </Link>
      <p>{product.price.toLocaleString("vi-VN")} đ</p>
      <button onClick={() => onAddToCart(product)}>Thêm vào giỏ</button>
    </div>
  );
}
