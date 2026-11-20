import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  backdropUrl,
  getMovie,
  getMovieCredits,
  getMovieTrailer,
  personUrl,
  posterUrl,
} from "../api/movieApi";
import Loader from "../components/Loader";

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [movieData, creditsData] = await Promise.all([
          getMovie(id),
          getMovieCredits(id),
        ]);
        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function openTrailer() {
    try {
      const url = await getMovieTrailer(id);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      else window.alert("Трейлер не найден.");
    } catch (err) {
      window.alert(err.message);
    }
  }

  if (loading) return <Loader />;
  if (error) return <div className="page-wrap"><div className="message-box"><p>{error}</p><Link to="/">На главную</Link></div></div>;
  if (!movie) return null;

  const backdrop = backdropUrl(movie.backdrop_path);
  const director = credits.crew?.find((person) => person.job === "Director");
  const cast = credits.cast?.slice(0, 12) || [];

  return (
    <div className="movie-details">
      {backdrop && <div className="details-background" style={{ backgroundImage: `url(${backdrop})` }} />}
      <div className="page-wrap details-wrap">
        <Link to="/" className="back-link">← Назад к фильмам</Link>
        <div className="details-layout">
          <img className="details-poster" src={posterUrl(movie.poster_path)} alt={movie.title} />
          <div className="details-copy">
            <p className="eyebrow">ИНФОРМАЦИЯ О ФИЛЬМЕ</p>
            <h1>{movie.title}</h1>
            {movie.original_title !== movie.title && <p className="original-title">{movie.original_title}</p>}
            <div className="details-meta">
              <span>★ {movie.vote_average?.toFixed(1) || "—"} / 10</span>
              <span>{movie.release_date || "Дата неизвестна"}</span>
              {movie.runtime ? <span>{movie.runtime} мин.</span> : null}
            </div>
            <div className="genres">{movie.genres?.map((genre) => <span key={genre.id}>{genre.name}</span>)}</div>
            {director && <p className="director-line"><strong>Режиссёр:</strong> {director.name}</p>}
            <h2>Описание</h2>
            <p className="overview">{movie.overview || "Описание пока недоступно."}</p>
            <button className="hero-button trailer-detail" onClick={openTrailer}>▶ Смотреть трейлер</button>
          </div>
        </div>

        <section className="cast-section">
          <div className="cast-heading">
            <p className="eyebrow">АКТЁРСКИЙ СОСТАВ</p>
            <h2>Кто снимался в фильме</h2>
          </div>
          {cast.length > 0 ? (
            <div className="cast-grid">
              {cast.map((person) => (
                <article className="cast-card" key={person.credit_id || person.id}>
                  <img src={personUrl(person.profile_path)} alt={person.name} loading="lazy" />
                  <div className="cast-card-info">
                    <h3>{person.name}</h3>
                    <p>{person.character || "Роль не указана"}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="message-box">Информация об актёрском составе пока недоступна.</div>
          )}
        </section>
      </div>
    </div>
  );
}
