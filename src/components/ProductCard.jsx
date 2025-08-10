import React from "react";

export default function ProductCard({ product, onAddToCart }) {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} style={{width: 150}} />
            <h3>{product.name}</h3>
            <p>{product.price.toLocaleString()}đ</p>
            <button onClick={()=> onAddToCart(product)}>Thêm vào giỏ</button>

        </div>
    )
}