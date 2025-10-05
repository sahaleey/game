// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
// No need to import BrowserRouter here anymore
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Now it just renders App, which contains its own router */}
    <App />
  </React.StrictMode>
);
