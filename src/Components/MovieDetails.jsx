import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";
import WatchProviders from "./WatchProviders";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerLoading, setIsTrailerLoading] = useState(false);
  const [watchProviders, setWatchProviders] = useState(null);

  const fetchWithCORS = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const fetchTrailer = async (movieId) => {
    setIsTrailerLoading(true);
    try {
      const data = await fetchWithCORS(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      setTrailerKey(trailer?.key);
    } catch (error) {
      console.error("Trailer fetch failed:", error);
    } finally {
      setIsTrailerLoading(false);
    }
  };

  const fetchWatchProviders = async () => {
    try {
      const data = await fetchWithCORS(
        `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      setWatchProviders(data.results?.US || null);
    } catch (error) {
      console.error("Watch providers fetch failed:", error);
    }
  };

  const fetchMovieDetails = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await fetchWithCORS(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      setMovieDetails(data);
    } catch (error) {
      setErrorMessage(`Error: ${error.message}. Please check the movie ID.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      fetchTrailer(id);
      fetchWatchProviders();
    }
  }, [id]);

  const formatReleaseDate = (dateString) => {
    if (!dateString) return "Unknown";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const renderStarRating = (voteAverage) => {
    const MAX_STARS = 5;
    const percentage = (voteAverage / 10) * 100;
    const filledStars = (voteAverage / 2).toFixed(1);

    return (
      <div className="rating">
        <div className="stars">
          <div className="stars-background">
            {[...Array(MAX_STARS)].map((_, i) => (
              <span key={`empty-${i}`}>★</span>
            ))}
          </div>
          <div
            className="stars-foreground"
            style={{ "--rating-percent": percentage }}
          >
            {[...Array(MAX_STARS)].map((_, i) => (
              <span key={`filled-${i}`}>★</span>
            ))}
          </div>
        </div>
        <span className="rating-value">{filledStars} / 5</span>
        <span>({voteAverage.toFixed(1)}/10)</span>
      </div>
    );
  };

  if (isLoading) return <div className="spinner"></div>;
  if (errorMessage) return <div className="error">{errorMessage}</div>;
  if (!movieDetails) return <div className="error">No movie data found.</div>;

  return (
    <div className="movie-details">
      <div
        className={`movie-backdrop ${!movieDetails.backdrop_path && "spinner"}`}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path})`,
        }}
      >
        <div className="movie-header-content">
          <h1 className="movie-title">{movieDetails.title}</h1>
        </div>
      </div>

      <div className="movie-info">
        <div className="movie-poster">
          <img
            src={
              movieDetails.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`
                : "/placeholder-poster.jpg"
            }
            alt={movieDetails.title}
          />
        </div>
        <div className="movie-meta">
          {movieDetails.vote_average && renderStarRating(movieDetails.vote_average)}

          <p>
            <strong>Release Date:</strong>{" "}
            {formatReleaseDate(movieDetails.release_date)}
          </p>

          <p><strong>Genres:</strong></p>
          <div className="genres">
            {movieDetails.genres?.length > 0 ? (
              movieDetails.genres.map((genre) => (
                <span key={genre.id} className="genre">
                  {genre.name}
                </span>
              ))
            ) : (
              <span className="genre">No genres listed</span>
            )}
          </div>
          
          {/* Corrected Trailer Section */}
          <section className="trailer-section">
            <h2>Trailer</h2>
            {isTrailerLoading ? (
              <div className="spinner"></div>
            ) : trailerKey ? (
              <div className="video-container">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=0&modestbranding=1&rel=0&enablejsapi=0`}
                  title={`${movieDetails.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
                ></iframe>
              </div>
            ) : (
              <p>No trailer available</p>
            )}
          </section>
        </div>
      </div>

      <div className="overview">
        <h3>Overview</h3>
        <p>{movieDetails.overview || "No overview available."}</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate("/")} className="back-button">
          ← Back to Home
        </button>
        
        {watchProviders && (
          <div className="watch-options">
            <h2>Watch Options</h2>
            <WatchProviders providers={watchProviders} movieId={id} />
            <a
              href={`https://www.themoviedb.org/movie/${id}/watch`}
              target="_blank"
              rel="noopener noreferrer"
              className="tmdb-link"
            >
              View all streaming options
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;