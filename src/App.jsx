import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; 
import { useDebounce } from "react-use";
import hero from './assets/hero.png';
import Search from "./Components/Search";
import Spinner from "./Components/Spinner";
import MovieCard from "./Components/MovieCard";
import MovieDetails from "./Components/MovieDetails"; 
import { updateSearchCount } from "./appwrite"; // Assuming updateSearchCount tracks searches

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
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
  const [moviesPerPage] = useState(36); // You can adjust this based on your preference.

  // Debouncing the search term to avoid sending requests too quickly
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  // Fetch Movies Based on Search Term or Trending
  const fetchMovies = async (query = '', page = 1) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
        : `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`;

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

  // Fetch Trending Movies
  const fetchTrendingMovies = async (page = 1) => {
    try {
      setIsTrendingLoading(true);
      setTrendingError('');
      const response = await fetch(`${API_BASE_URL}/trending/movie/day?api_key=${API_KEY}&page=${page}`);
      const data = await response.json();
      setTrendingMovies(data.results);
      setTotalPages(data.total_pages); // Ensure total pages for trending
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingError('Error fetching trending movies. Please try again later.');
    } finally {
      setIsTrendingLoading(false);
    }
  };

  // Handle Page Change (Pagination) for Trending
  const handlePageChangeTrending = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchTrendingMovies(page); // Fetch trending movies for the new page
    }
  };

  // Handle Page Change (Pagination) for Search
  const handlePageChangeSearch = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchMovies(debounceSearchTerm, page); // Fetch search results for the new page
    }
  };

  // Fetch Movies and Trending Movies on Initial Render or Search Term Change
  useEffect(() => {
    if (debounceSearchTerm) {
      fetchMovies(debounceSearchTerm, currentPage);
    } else {
      fetchTrendingMovies(currentPage);
    }
  }, [debounceSearchTerm, currentPage]);

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
                  <h2>{debounceSearchTerm ? 'Search Results' : 'Trending Movies'}</h2>
                  {isLoading || isTrendingLoading ? (
                    <Spinner />
                  ) : errorMessage || trendingError ? (
                    <p className="text-red-500">{errorMessage || trendingError}</p>
                  ) : (
                    <ul>
                      {(debounceSearchTerm ? moviesList : trendingMovies).map((movie) => (
                        <Link to={`/movie/${movie.id}`} key={movie.id}>
                          <MovieCard movie={movie} />
                        </Link>
                      ))}
                    </ul>
                  )}

                  {totalPages > 1 && !debounceSearchTerm && (
                    <div className="pagination">
                      <button
                        className="pagination-button"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChangeTrending(currentPage - 1)}
                      >
                        Previous
                      </button>
                      <span>{`Page ${currentPage} of ${totalPages}`}</span>
                      <button
                        className="pagination-button"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChangeTrending(currentPage + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}

                  {debounceSearchTerm && totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-button"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChangeSearch(currentPage - 1)}
                      >
                        Previous
                      </button>
                      <span>{`Page ${currentPage} of ${totalPages}`}</span>
                      <button
                        className="pagination-button"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChangeSearch(currentPage + 1)}
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
