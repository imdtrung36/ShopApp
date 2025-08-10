import ProductItem from "./ProductItem";

export default function ProductList({ products, onAddToCart }) {
  return (
    <div className="product-list">
      {products.map((p) => (
        <ProductItem key={p.id} product={p} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
