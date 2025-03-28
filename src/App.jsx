import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // Import router
import { useDebounce } from "react-use";
import hero from './assets/hero.png';
import Search from "./Components/Search";
import Spinner from "./Components/Spinner";
import MovieCard from "./Components/MovieCard";
import MovieDetails from "./Components/MovieDetails"; // Import MovieDetails component
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import MoviePlayer from "./Components/WatchProviders";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [moviesPerPage] = useState(36);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '', page = 1) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Error fetching movies');
      }

      const data = await response.json();
      if (data.results.length === 0) {
        setMoviesList([]);
        setErrorMessage('No movies found. Please try another search.');
        setIsLoading(false);
        return;
      }

      setMoviesList(data.results);
      setTotalPages(data.total_pages);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(`Error fetching movies: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      setIsTrendingLoading(true);
      setTrendingError('');
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingError('Error fetching trending movies. Please try again later.');
    } finally {
      setIsTrendingLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchMovies(debounceSearchTerm, page);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm, currentPage);
  }, [debounceSearchTerm, currentPage]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <Router>
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <header>
            <img src={hero} alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You Will Enjoy Without A Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <Routes>
            <Route
              path="/"
              element={
                <section className="all-movies">
                  <h2>All Movies</h2>
                  {isLoading ? (
                    <Spinner />
                  ) : errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
                  ) : (
                    <ul>
                      {moviesList.map((movie) => (
                        <Link to={`/movie/${movie.id}`} key={movie.id}>
                        <MovieCard movie={movie} />
                      </Link>
                      
                      ))}
                    </ul>
                  )}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                      <span>{`Page ${currentPage} of ${totalPages}`}</span>
                      <button
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </section>
              }
            />
            <Route
              path="/movie/:id"
              element={<MovieDetails />}
            />
          </Routes>       
        </div>
      </main>
    </Router>
  );
}

export default App;
