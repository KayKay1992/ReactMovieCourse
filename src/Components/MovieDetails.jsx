import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  //trailer states
  const [trailerKey, setTrailerKey] = useState(null);
const [isTrailerLoading, setIsTrailerLoading] = useState(false);


//fetch trailer logic
const fetchTrailer = async (movieId) => {
  setIsTrailerLoading(true);
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
    );
    const data = await response.json();
    const trailer = data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    setTrailerKey(trailer?.key);
  } catch (error) {
    console.error("Error fetching trailer:", error);
  } finally {
    setIsTrailerLoading(false);
  }
};

useEffect(() => {
  if (id) {
    fetchTrailer(id);
  }
}, [id]);

  // Helper function to format release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return "Unknown";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const fetchMovieDetails = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch (HTTP ${response.status})`);
      }
      const data = await response.json();
      setMovieDetails(data);
      //   const data = await response.json();
      // console.log("Genres data:", data.release_date); // Check if genres exist
      setMovieDetails(data);
    } catch (error) {
      setErrorMessage(`Error: ${error.message}. Please check the movie ID.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMovieDetails();
  }, [id]);

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
          {movieDetails.vote_average &&
            renderStarRating(movieDetails.vote_average)}

          <p>
            <strong>Release Date:</strong>{" "}
            {formatReleaseDate(movieDetails.release_date)}
          </p>

          <p>
            <strong>Genres:</strong>
          </p>
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
                  {/* Trailer Section */}
    <section className="trailer-section">
      <h2>Trailer</h2>
      {isTrailerLoading ? (
        <div className="spinner"></div>
      ) : trailerKey ? (
        <div className="video-container">
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title={`${movieDetails.title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
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
        {/* Back button added here */}
        <button onClick={() => navigate("/")} className="back-button">
        ← Back to Home
      </button>
    </div>
  );
};

export default MovieDetails;
