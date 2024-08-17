import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCart, getCartData } from "../../redux/dataSlice";

import Card from "./Card";
import Shoppingcart from "./Shoppingcart";

export default function Category({ categories, productData }) {
  // console.log(categories,"categories")
  // const {name , slug, url} = categories;
  const dispatch = useDispatch(); // Get the dispatch function

  const isShoppingCart = useSelector((state) => state.isShoppingCart);
  const [filteredData, setFilteredData] = useState([]);

const handleCategory = (selectedCategory, event) => {
  event.preventDefault();
  
  // Log the selected category to verify it's correct
  // console.log("Selected Category:", selectedCategory);

  // Filter the products
  const filteredProducts = productData.products.filter((product) => {
    // console.log("Product Category:", product.category); // Log each product category
    return product.category === selectedCategory;
  });

  // Log the filtered products
  // console.log("Filtered Products:", filteredProducts);

  // Update state
  setFilteredData(filteredProducts);
};

  const handleShoppingCart = (e, id) => {
    e.preventDefault();
    dispatch(isCart(!isShoppingCart));
    dispatch(getCartData(id));

    // Dispatch the action
  };
  // console.log(isShoppingCart);

  return (
    <div className="bg-slate-700">
      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <form className="hidden lg:block">
                <ul
                  role="list"
                  className="::-webkit-scrollbar-thumb:hover ::-webkit-scrollbar-thumb  h-screen overflow-y-scroll space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-white"
                >
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <button
                        type="button"
                        onClick={(e) => handleCategory(category.slug, e)}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3 ::-webkit-scrollbar-thumb:hover ::-webkit-scrollbar-thumb h-screen overflow-y-scroll">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredData.length > 0 ? (
                    filteredData.map((product) => (
                      <Card
                        key={product.id}
                        product={product}
                        handleShoppingCart={handleShoppingCart}
                      />
                    ))
                  ) : productData.products &&
                    Array.isArray(productData.products) ? (
                    productData.products.map((product) => (
                      <Card
                        key={product.id}
                        product={product}
                        handleShoppingCart={handleShoppingCart}
                      />
                    ))
                  ) : (
                    <p>No products available</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Shoppingcart handleShoppingCart={handleShoppingCart} />
    </div>
  );
}
