import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <footer className="footer">© 2026 CINEMA. Данные о фильмах предоставлены TMDB.</footer>
    </div>
  );
}