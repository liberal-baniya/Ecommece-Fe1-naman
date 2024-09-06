import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card"; 

export default function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist); 

  if (wishlist.length === 0) {
    return <div className="p-6 text-center">Your wishlist is empty</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
