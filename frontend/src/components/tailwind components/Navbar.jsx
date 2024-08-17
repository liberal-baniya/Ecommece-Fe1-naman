import { useState } from "react";

import Card from "./Card";

export default function Category({ categories, productData }) {
  // console.log(productData)

  const [filteredData, setFilteredData] = useState([]);
  const handleCategory = (selectedCategory, event) => {
    event.preventDefault();
  
    const filteredProducts = productData.products.filter((product) => {
      return product.category === selectedCategory;
    });
    setFilteredData(filteredProducts);
  };
  

  return (
    <div className="bg-slate-700">
      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <form className="hidden lg:block">
                <ul
                  role="list"
                  className="::-webkit-scrollbar-thumb:hover ::-webkit-scrollbar-thumb  h-1/6 overflow-y-scroll space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-white"
                >
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        key={category}
                        onClick={(e) => handleCategory(category, e)}
                      >
                        {category.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3 ::-webkit-scrollbar-thumb:hover ::-webkit-scrollbar-thumb h-1/6 overflow-y-scroll">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredData.length > 0 ? (
                    filteredData.map((product) => (
                      <Card key={product.id} product={product} />
                    ))
                  ) : productData.products &&
                    Array.isArray(productData.products) ? (
                    productData.products.map((product) => (
                      <Card key={product.id} product={product} />
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
    </div>
  );
}
