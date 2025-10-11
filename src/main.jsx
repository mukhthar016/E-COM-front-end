// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import {CartProvider} from "./context/CartContext";
import {AddressProvider} from "./context/AddressContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AddressProvider> 
        <CartProvider>
      <App />
      </CartProvider>
      </AddressProvider>
    </AuthProvider>
  </React.StrictMode>
);
