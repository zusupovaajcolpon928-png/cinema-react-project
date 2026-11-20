import { useEffect, useState } from "react";
import {
  getMovieList,
  getMoviesByGenre,
  getMovieTrailer,
  searchMovies,
} from "../api/movieApi";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

const collections = [
  { label: "Сейчас в кино", id: "now_playing" },
  { label: "Популярные", id: "popular" },
  { label: "Высокий рейтинг", id: "top_rated" },
  { label: "Скоро выйдут", id: "upcoming" },
];

const categories = [
  { label: "Все жанры", id: "all" },
  { label: "Боевики", id: 28 },
  { label: "Приключения", id: 12 },
  { label: "Мультфильмы", id: 16 },
  { label: "Комедии", id: 35 },
  { label: "Криминал", id: 80 },
  { label: "Документальные", id: 99 },
  { label: "Драмы", id: 18 },
  { label: "Семейные", id: 10751 },
  { label: "Фэнтези", id: 14 },
  { label: "История", id: 36 },
  { label: "Ужасы", id: 27 },
  { label: "Музыка", id: 10402 },
  { label: "Детективы", id: 9648 },
  { label: "Мелодрамы", id: 10749 },
  { label: "Фантастика", id: 878 },
  { label: "Телевизионные фильмы", id: 10770 },
  { label: "Триллеры", id: 53 },
  { label: "Военные", id: 10752 },
  { label: "Вестерны", id: 37 },
];

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [activeCollection, setActiveCollection] = useState("now_playing");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadMovies(1, activeCollection, activeCategory);
  }, []);

  async function loadMovies(nextPage = 1, collection = activeCollection, category = activeCategory) {
    try {
      setLoading(true);
      setError("");
      const data = category !== "all"
        ? await getMoviesByGenre(category, nextPage)
        : await getMovieList(collection, nextPage);
      setMovies(data.results);
      setPage(nextPage);
      setTotalPages(Math.min(data.totalPages, 500));
      setSearchMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    if (!search.trim()) {
      loadMovies(1, activeCollection, activeCategory);
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSearchMode(true);
      const data = await searchMovies(search.trim());
      setMovies(data.results);
      setPage(1);
      setTotalPages(Math.min(data.totalPages, 500));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function changePage(nextPage) {
    if (searchMode) {
      try {
        setLoading(true);
        const data = await searchMovies(search.trim(), nextPage);
        setMovies(data.results);
        setPage(nextPage);
        setTotalPages(Math.min(data.totalPages, 500));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      loadMovies(nextPage);
    }
    document.getElementById("movies")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleTrailer(movieId) {
    try {
      const trailer = await getMovieTrailer(movieId);
      if (trailer) window.open(trailer, "_blank", "noopener,noreferrer");
      else window.alert("Трейлер для этого фильма не найден.");
    } catch (err) {
      window.alert(err.message);
    }
  }

  const activeLabel = categories.find((item) => item.id === activeCategory)?.label || "Фильмы";
  const collectionLabel = collections.find((item) => item.id === activeCollection)?.label || "Фильмы";
  const sectionTitle = searchMode
    ? "Результаты поиска"
    : activeCategory !== "all"
      ? activeLabel
      : collectionLabel;

  function chooseCollection(id) {
    setActiveCollection(id);
    setActiveCategory("all");
    setSearch("");
    loadMovies(1, id, "all");
  }

  function chooseCategory(id) {
    setActiveCategory(id);
    setSearch("");
    loadMovies(1, activeCollection, id);
  }

  return (
    <div className="page-wrap">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ОТКРОЙ СВОЮ СЛЕДУЮЩУЮ ИСТОРИЮ</p>
          <h1>Мир кино<br /><span>начинается здесь.</span></h1>
          <p className="hero-description">Находи фильмы, открывай новые истории и выбирай, что посмотреть сегодня.</p>
          <a href="#movies" className="hero-button">Смотреть фильмы <span>↘</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-ring ring-one" /><div className="hero-ring ring-two" />
          <div className="hero-letter">C</div>
          <span className="hero-art-caption">LIGHTS · CAMERA · ACTION</span>
        </div>
      </section>

      <section className="catalog" id="movies">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">КАТАЛОГ CINEMA</p>
            <h2>{sectionTitle}</h2>
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Найти фильм..." aria-label="Найти фильм" />
            <button type="submit" aria-label="Поиск">⌕</button>
          </form>
        </div>

        <p className="filter-label">ПОДБОРКИ</p>
        <div className="category-list">
          {collections.map((item) => (
            <button key={item.id} className={`category-button collection-button ${activeCollection === item.id && activeCategory === "all" && !searchMode ? "active" : ""}`} onClick={() => chooseCollection(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        <p className="filter-label">ЖАНРЫ</p>
        <div className="category-list genre-categories">
          {categories.map((category) => (
            <button key={category.id} className={`category-button ${activeCategory === category.id && !searchMode ? "active" : ""}`} onClick={() => chooseCategory(category.id)}>
              {category.label}
            </button>
          ))}
        </div>

        {searchMode && <button className="back-to-all" onClick={() => { setSearch(""); loadMovies(1, activeCollection, activeCategory); }}>← Вернуться к фильмам</button>}
        {loading && <Loader />}
        {!loading && error && <div className="message-box"><h3>Не удалось загрузить фильмы</h3><p>{error}</p><button onClick={() => loadMovies(page)}>Повторить</button></div>}
        {!loading && !error && (
          <>
            <div className="genre-heading">
              <h3>{sectionTitle} <span>({movies.length} на странице)</span></h3>
            </div>
            {movies.length > 0 ? (
              <div className="movies-grid">
                {movies.map((movie) => <MovieCard key={movie.id} movie={movie} onTrailer={handleTrailer} />)}
              </div>
            ) : (
              <div className="message-box"><p>{searchMode ? "Фильмы не найдены. Попробуй другое название." : "Фильмы в этой подборке не найдены."}</p></div>
            )}
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page <= 1} onClick={() => changePage(page - 1)}>← Назад</button>
                <span>Страница {page} из {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => changePage(page + 1)}>Вперёд →</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
