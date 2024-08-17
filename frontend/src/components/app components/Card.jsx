import { Link } from "react-router-dom";

function Card({ product, handleShoppingCart }) {
  const { id, price, title, thumbnail, brand } = product;

  return (
    <div className="mb-8 mx-auto w-72 bg-white shadow-lg rounded-md overflow-hidden">
      <div className="h-56 overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-between p-4 h-44"> {/* Adjusted height for demonstration */}
        <div>
          <h1 className="text-md font-semibold text-gray-800 mb-2">{title}</h1>
          <p className="text-sm text-gray-500 mb-2">{brand}</p>
          <div className="flex items-center justify-between mb-4"> {/* Adjusted margin */}
            <span className="text-sm font-semibold text-gray-800">${price}</span>
            <button
              onClick={(e) => handleShoppingCart(e, id)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
        {/* This div is the footer and should stay at the bottom */}
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
