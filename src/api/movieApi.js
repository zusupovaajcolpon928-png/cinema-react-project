const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.REACT_APP_TMDB_TOKEN;

async function request(url) {
  if (!TOKEN) {
    throw new Error("Не найден TMDB Token. Создай файл .env и добавь REACT_APP_TMDB_TOKEN.");
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Неверный TMDB Token. Проверь значение в .env.");
    if (response.status === 404) throw new Error("Информация не найдена.");
    throw new Error("Ошибка загрузки данных TMDB. Попробуй обновить страницу.");
  }

  return response.json();
}

export async function getMovieList(type = "now_playing", page = 1) {
  const data = await request(`/movie/${type}?language=ru-RU&page=${page}`);
  return { results: data.results || [], totalPages: data.total_pages || 1 };
}

export async function getNowPlaying(page = 1) {
  const data = await getMovieList("now_playing", page);
  return data.results;
}

export async function getMoviesByGenre(genreId, page = 1) {
  const data = await request(
    `/discover/movie?include_adult=false&include_video=false&language=ru-RU&page=${page}&sort_by=popularity.desc&with_genres=${genreId}`
  );
  return { results: data.results || [], totalPages: data.total_pages || 1 };
}

export async function searchMovies(query, page = 1) {
  const data = await request(
    `/search/movie?query=${encodeURIComponent(query)}&language=ru-RU&page=${page}&include_adult=false`
  );
  return { results: data.results || [], totalPages: data.total_pages || 1 };
}

export async function getMovie(id) {
  const movie = await request(`/movie/${id}?language=ru-RU`);

  // Если описание на русском есть — показываем его
  if (movie.overview && movie.overview.trim() !== "") {
    return movie;
  }

  // Если русского описания нет — запрашиваем английское
  const englishMovie = await request(
    `/movie/${id}?language=en-US`
  );

  return {
    ...movie,
    overview: englishMovie.overview || "",
  };
}

export async function getMovieCredits(id) {
  return request(`/movie/${id}/credits?language=ru-RU`);
}

export async function getMovieTrailer(id) {
  let data = await request(`/movie/${id}/videos?language=ru-RU`);
  let trailer = data.results?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );
  if (!trailer) {
    data = await request(`/movie/${id}/videos?language=en-US`);
    trailer = data.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );
  }
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

export function posterUrl(path) {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/500x750/19191e/e8aa62?text=CINEMA";
}

export function personUrl(path) {
  return path
    ? `https://image.tmdb.org/t/p/w185${path}`
    : "https://placehold.co/185x278/24232a/e8aa62?text=ACTOR";
}

export function backdropUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w1280${path}` : "";
}
