import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import LoginForm from "./components/app components/LoginForm.jsx";
import Signup from "./components/app components/Signup.jsx";
import Productdetailpage from "./components/app components/Productdetailpage.jsx";
import Wishlist from "./components/app components/Wishlist.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/productdetailpage/:id" element={<Productdetailpage />} />
      </Routes>
    </Router>
  </Provider>
);
