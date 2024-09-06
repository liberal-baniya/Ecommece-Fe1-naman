import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../redux/dataSlice";

function Card({ product, handleShoppingCart }) {
  const { id, price, title, thumbnail, brand } = product;
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const isWishlisted = wishlist.some((item) => item.id === id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <div className="mb-8 mx-auto w-72 bg-white shadow-lg rounded-md overflow-hidden">
      <div className="h-56 overflow-hidden relative">
        <img
          src={thumbnail}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105"
        />
        {/* Wishlist Icon in the top-right corner */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 text-red-500 text-2xl"
        >
          <FontAwesomeIcon icon={isWishlisted ? solidHeart : regularHeart} />
        </button>
      </div>
      <div className="flex flex-col justify-between p-4 h-44">
        <div>
          <h1 className="text-md font-semibold text-gray-800 mb-2">{title}</h1>
          <p className="text-sm text-gray-500 mb-2">{brand}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-800">
              ${price}
            </span>
            <button
              onClick={(e) => handleShoppingCart(e, id)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
        <div className="mt-auto">
          <Link
            to={`/productdetailpage/${id}`}
            className="block text-center text-sm text-blue-500 underline hover:text-blue-700 transition duration-300"
          >
            Click here to know more
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
