import React, { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import hero from './assets/hero.png';
import Search from "./Components/Search";
import Spinner from "./Components/Spinner";
import MovieCard from "./Components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

// API - Application Programming Interface - a set of rules that allows one software application to talk to another application.

// Define the API base URL
const API_BASE_URL = "https://api.themoviedb.org/3";

// Define the API key
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Define the API options
const API_OPTIONS = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [moviesList, setMoviesList] = useState([]); // Movies state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [debounceSearchTerm, setDebounceSearchTerm] = useState(''); // Debounced search term
  const [trendingMovies, setTrendingMovies] = useState([]); // Trending movies state
  const [isTrendingLoading, setIsTrendingLoading] = useState(false); // Loading state for trending movies
  const [trendingError, setTrendingError] = useState(''); // Error state for trending movies

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [moviesPerPage] = useState(20); // Number of movies per page

  // Debounce hook for search term
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  // Fetch movies based on search term and pagination
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
      setTotalPages(data.total_pages); // Set total pages for pagination

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

  // Function to fetch trending movies
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

  // Handle page changes for pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchMovies(debounceSearchTerm, page);
    }
  };

  // useEffect hook to fetch movies when the search term or page changes
  useEffect(() => {
    fetchMovies(debounceSearchTerm, currentPage);
  }, [debounceSearchTerm, currentPage]);

  // useEffect hook to fetch trending movies when the component mounts
  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
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

        {/* Trending Movies Section */}
        <section className="trending">
          <h2>Trending Movies</h2>
          {isTrendingLoading ? (
            <Spinner />
          ) : trendingError ? (
            <p className="text-red-500">{trendingError}</p>
          ) : (
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                  <h3>{movie.title}</h3>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* All Movies Section */}
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="pagination"
              >
                Previous
              </button>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="pagination"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
