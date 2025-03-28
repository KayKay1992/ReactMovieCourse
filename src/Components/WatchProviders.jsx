import React from 'react';
import './WatchProviders.css';

const WatchProviders = ({ providers, movieId }) => {  // Add movieId as prop
  if (!providers) return null;

  return (
    <div className="watch-providers">
      <h3>Where to Watch</h3>
      <div className="providers-grid">
        {providers.flatrate?.map(provider => (
          <a
            key={provider.provider_id}
            href={`https://www.themoviedb.org/movie/${movieId}/watch`}  // Use the prop
            target="_blank"
            rel="noopener noreferrer"
            className="provider"
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
              alt={provider.provider_name}
              title={provider.provider_name}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default WatchProviders;