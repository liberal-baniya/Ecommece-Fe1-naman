import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingCart, getCartData, setError } from '../../redux/dataSlice';
import Shoppingcart from './Shoppingcart';

function ProductDetailPage() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const isShoppingCart = useSelector((state) => state.isShoppingCart);
  const isLoadingCart = useSelector((state) => state.isLoadingCart);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    // Fetch product details using the ID
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        dispatch(setError('Failed to fetch product details'));
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, dispatch]);

  // Function to handle adding the product to the cart
  const handleShoppingCart =  (e) => {
    e.preventDefault();
    dispatch(setLoadingCart());
    try {
       dispatch(getCartData(id));
    } catch (error) {
      console.error('Failed to update cart:', error);
      dispatch(setError('Failed to update cart'));
    }
  };

  if (loading) return <div className="p-6 text-center">Loading product details...</div>;

  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 flex flex-col items-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} ${index}`}
                className="w-24 h-24 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>
        <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-lg text-gray-700 mt-2">{product.description}</p>
          <p className="text-xl font-semibold text-gray-900 mt-2">${product.price}</p>
          <p className="text-sm text-gray-600 mt-2">Brand: {product.brand}</p>
          <p className="text-sm text-gray-600 mt-2">Category: {product.category}</p>
          <p className="text-sm text-gray-600 mt-2">SKU: {product.sku}</p>
          <p className="text-sm text-gray-600 mt-2">Stock: {product.stock}</p>
          <p className="text-sm text-gray-600 mt-2">Rating: {product.rating}</p>
          <p className="text-sm text-gray-600 mt-2">Discount: {product.discountPercentage}%</p>
          <p className="text-sm text-gray-600 mt-2">Shipping Information: {product.shippingInformation}</p>
          <p className="text-sm text-gray-600 mt-2">Return Policy: {product.returnPolicy}</p>
          <p className="text-sm text-gray-600 mt-2">Warranty: {product.warrantyInformation}</p>
          <p className="text-sm text-gray-600 mt-2">Minimum Order Quantity: {product.minimumOrderQuantity}</p>
          <p className="text-sm text-gray-600 mt-2">Availability: {product.availabilityStatus}</p>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={handleShoppingCart}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 transition duration-300"
            >
              {isLoadingCart ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-200 transition duration-300"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
      <Shoppingcart handleShoppingCart={handleShoppingCart} />
    </div>
  );
}

export default ProductDetailPage;
