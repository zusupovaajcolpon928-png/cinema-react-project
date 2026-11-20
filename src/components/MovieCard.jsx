import { Link } from "react-router-dom";
import { posterUrl } from "../api/movieApi";

export default function MovieCard({ movie, onTrailer }) {
  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="poster-link">
        <img className="poster" src={posterUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
        <span className="poster-rating">★ {movie.vote_average ? movie.vote_average.toFixed(1) : "—"}</span>
      </Link>
      <div className="movie-card-info">
        <Link to={`/movie/${movie.id}`} className="movie-title">{movie.title}</Link>
        <p className="movie-date">{movie.release_date || "Дата неизвестна"}</p>
        <div className="movie-actions">
          <Link className="details-link" to={`/movie/${movie.id}`}>Подробнее</Link>
          <button className="trailer-button" onClick={() => onTrailer(movie.id)}>▶ ТРЕЙЛЕР</button>
        </div>
      </div>
    </article>
  );
}