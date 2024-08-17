import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories, getProductData, setLoadingProducts, setLoadingCategories, setError } from './redux/dataSlice';
import Navbarr from './components/app components/Navbarr';
import Category from './components/app components/Category';

function App() {
  const { productData, categories, isLoadingProducts, isLoadingCategories, error } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductData = async () => {
      dispatch(setLoadingProducts());
      try {
        const response = await fetch('https://dummyjson.com/products?limit=00');
        const data = await response.json();
        dispatch(getProductData(data.products));
      } catch (error) {
        console.error("Error fetching products", error);
        dispatch(setError('Error fetching products'));
      }
    };

    fetchProductData();
  }, [dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(setLoadingCategories());
      try {
        const response = await fetch('https://dummyjson.com/products/categories');
        const data = await response.json();
        dispatch(getCategories(data));
      } catch (error) {
        console.error("Error fetching categories", error);
        dispatch(setError('Error fetching categories'));
      }
    };

    fetchCategories();
  }, [dispatch]);

  if (isLoadingProducts || isLoadingCategories) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <div>
        <Navbarr />
        <Category categories={categories} productData={productData} />
      </div>
    </>
  );
}

export default App;
