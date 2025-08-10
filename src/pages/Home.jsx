import ProductList from "../components/ProductList";
import productsData from "../data/products";

export default function Home({ onAddToCart, products, children }) {
  return (
    <div className="container" style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      {children}
      <h2 style={{marginTop: 12}}>Sản phẩm</h2>
      <ProductList products={productsData} onAddToCart={onAddToCart} />
    </div>
  );
}
