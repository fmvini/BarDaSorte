import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { FavoritesProvider } from "./context/FavoritesProvider.jsx";
import { PantryProvider } from "./context/PantryProvider.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/app.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <PantryProvider>
            <App />
          </PantryProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
