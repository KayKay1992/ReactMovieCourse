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
  // Debounce search term to prevent unnecessary API calls
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  // Trending movies state
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false); // Loading state for trending movies
  const [trendingError, setTrendingError] = useState(''); // Error state for trending movies

  // Debounce hook to wait for the user to stop typing for 500ms before it starts searching
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  // Function to fetch movies based on the search term
  const fetchMovies = async (query = '') => {
    try {
      // Show loading state
      setIsLoading(true);
      // Clear the error message
      setErrorMessage('');

      // Construct the endpoint based on the query (search term or popular movies)
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // Fetch data from the API
      const response = await fetch(endpoint, API_OPTIONS);

      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Error fetching movies');
      }

      // Parse the response as JSON
      const data = await response.json();

      // Check if no results are returned
      if (data.results.length === 0) {
        setMoviesList([]);
        setErrorMessage('No movies found. Please try another search.');
        setIsLoading(false);
        return;
      }

      // Set the movies state with the received data
      setMoviesList(data.results);
      if (query && data.results.length > 0) {
        // Update the search count
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(`Error fetching movies: ${error.message}`);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Function to load trending movies
  const fetchTrendingMovies = async () => {
    setIsTrendingLoading(true); // Start loading state for trending movies
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingError(`Error fetching trending movies: ${error.message}`);
    } finally {
      setIsTrendingLoading(false); // End loading state for trending movies
    }
  };

  // useEffect hook to fetch movies when the search term changes
  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]); // Trigger whenever searchTerm changes

  // useEffect hook to fetch trending movies when the component mounts
  useEffect(() => {
    fetchTrendingMovies();
  }, []); // Only trigger once when the component mounts

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

        {/* Conditional Rendering for Trending Movies */}
        {isTrendingLoading ? (
          <Spinner /> // Show loading spinner while fetching trending movies
        ) : trendingError ? (
          <p className="text-red-500">{trendingError}</p> // Show error message if there's an error fetching trending movies
        ) : trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id || index}> {/* Ensure unique "key" for each item */}
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                  <h3>{movie.title}</h3>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {/* Conditional Rendering for All Movies */}
          {isLoading ? (
            <Spinner /> // Show loading spinner while fetching movies
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p> // Show error message if there's an error fetching movies
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} /> // Ensure unique "key" for each movie card
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
