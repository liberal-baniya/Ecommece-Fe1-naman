import { createSlice } from "@reduxjs/toolkit";


// console.log(productdata)
const initialState = {
  // productData: [],
  productData: {products:[]},
  categories: [],
  isShoppingCart: false,
  ShoppingCartData: [],
  isLoadingProducts: false,
  isLoadingCategories: false,
  isLoadingCart: false,
  totalValue: 0,
};

export const dataSlice = createSlice({
  name: "productdata",
  initialState,
  reducers: {
    getProductData: (state, action) => {
      state.productData.products = action.payload;
      state.isLoadingProducts = false;
    },
    getCategories: (state, action) => {
      state.categories = action.payload;
      state.isLoadingCategories = false;
    },
    setLoadingProducts: (state) => {
      state.isLoadingProducts = true;
    },
    setLoadingCategories: (state) => {
      state.isLoadingCategories = true;
    },
    isCart: (state, action) => {
      state.isShoppingCart = action.payload;
    },
    setLoadingCart: (state) => {
      state.isLoadingCart = true;
    },
    getCartData: (state, action) => {
      state.isLoadingCart = false;
      console.log('Current state:', state);
      console.log('Available products:', state.productData);
      // Check if ShoppingCartData and productData.products are defined
      if (!state.ShoppingCartData) {
        state.ShoppingCartData = [];
      }
    
      if (!state.productData || !state.productData.products) {
        console.error('Product data is not available');
        return;
      }
    
      // Find the index of the product with the given ID in ShoppingCartData
      const productIndex = state.ShoppingCartData.findIndex(
        (product) => product.id === action.payload
      );
    
      // If the product exists in ShoppingCartData, update its count
      if (productIndex !== -1) {
        state.ShoppingCartData[productIndex].count += 1;
      } else {
        // If the product doesn't exist, push it with an initial count of 1
        console.log(action.payload , "action.payload");
        const newProduct = state.productData.products.find(
          (product) => product.id ===  action.payload
          
        );
        console.log(newProduct)
    
        if (newProduct) {
          state.ShoppingCartData.push({ ...newProduct, count: 1 });
        }
      }
    
      // Reset total value first
      state.totalValue = 0;
    
      // Update total value based on the updated ShoppingCartData
      state.ShoppingCartData.forEach((product) => {
        state.totalValue += product.count * product.price;
      });
    },
    
    removeCartData: (state, action) => {
      const productIndex = state.ShoppingCartData.findIndex(
        (product) => product.id === action.payload
      );

      state.ShoppingCartData = [
        ...state.ShoppingCartData.slice(0, productIndex),
        ...state.ShoppingCartData.slice(productIndex + 1),
      ];
      state.totalValue = 0; // Reset total value first
      state.ShoppingCartData.forEach((product) => {
        state.totalValue += product.count * product.price;
      });
    },
    totalCartValue: (state) => {
      // Reset the total value to 0 before calculating
      state.totalValue = 0;

      state.ShoppingCartData.forEach((product) => {
        state.totalValue += product.count * product.price;
      });
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoadingProducts = false;
      state.isLoadingCategories = false;
      state.isLoadingCart = false;
    },
  },
});


export const {
  getCategories,
  getProductData,
  setLoadingProducts,
  setLoadingCategories,
  isCart,
  getCartData,
  removeCartData,
  totalCartValue,
  setError,
  setLoadingCart
  
} = dataSlice.actions;

export default dataSlice.reducer;
