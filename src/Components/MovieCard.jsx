import React from 'react'
import start_Icon from '../assets/star.svg'
import no_image from '../assets/no-movie.png'

const MovieCard = ({movie: {title, vote_average, poster_path, release_date, original_language }}) => {
  return (
    <div className='movie-card'>
       {/* <img src={`https://image.tmdb.org/t/p/w185/${poster_path}`} alt={title} />
      <h3>{title}</h3> */}
      <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : no_image} alt={title}/>
      <div className='mt-4'>
        <h3>{title}</h3>
       <div className="content">
        <div className="rating">
            <img src={start_Icon} alt='Star Icon'/>
            <p>{vote_average ? vote_average.toFixed(1): 'N/A'}</p>
        </div>
        <span>•</span>
        <p className='lang'>{original_language}</p>
        <span>•</span>
        <p className="year">
            {release_date? new Date(release_date).getFullYear() : 'N/A'}
        </p>
       </div>
      </div>
    </div>
  )
}

export default MovieCard