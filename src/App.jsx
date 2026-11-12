import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Pantry from "./pages/Pantry.jsx";
import Favorites from "./pages/Favorites.jsx";
import DrinkDetails from "./pages/DrinkDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="buscar" element={<Search />} />
        <Route path="despensa" element={<Pantry />} />
        <Route path="favoritos" element={<Favorites />} />
        <Route path="drink/:id" element={<DrinkDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
