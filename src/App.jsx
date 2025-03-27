import React, { useState, useEffect } from "react";
import hero from './assets/hero.png'
import Search from "./Components/Search";
import Spinner from "./Components/Spinner";

//API - Application Programming Interface - a set of rules that allows onesoftware application to talk to another application.

//Define the api base url
const API_BASE_URL = "https://api.themoviedb.org/3";


//Define the api key
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

//Define the api options
const API_OPTIONS = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`,
  },
};


function App() {
  const [searchTerm, setSearchTerm] = useState('')
  //error message state
  const [errorMessage, setErrorMessage] = useState('')
  //movies state
  const [moviesList, setMoviesList] = useState([])
  //loading state
  const [isLoading, setIsLoading] = useState(false)


  //Declare a function that will allow you to fetch those movies.

  const fetchMovies = async () => {
    try {
      //show loading state
      setIsLoading(true)
      //clear the error message
      setErrorMessage('')

      
      //We're using the TMDB API to fetch movies in descending order by popularity.
      //define exact endpoint you are trying to call
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      //Then call the endpoint
      const response = await fetch(endpoint, API_OPTIONS);
      //Check if the response was successful
      if (!response.ok) {
        throw new Error(`Error fetching movies`);
      }
      //If successful, parse the response as JSON and log the data to the console.
      const data = await response.json()
      //Set the movies state with the received data
      if(data.response === 'false'){
        setErrorMessage(data.Error || 'failed to fetch movies');
        setMoviesList([])
        setIsLoading(false)
        return
      }
      //if fetching is successful
      setMoviesList(data.results || []);
      
      //Set the movies state with the received data
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(`Error fetching movies: ${error.message}`);
    }
    finally{
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchMovies()
  },
[])
  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src={hero} alt="Hero Banner"/>
          <h1> Find <span className="text-gradient ">Movies </span>You Will Enjoy Without A Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
       <section className="all-movies">
          <h2  className="mt-40">All Movies</h2>
         {/* Advance conditional rendeering */}
         {isLoading ? (
          <Spinner/>
         ): errorMessage ? (
          <p className="text-red-500">
            {errorMessage}
          </p>
         ): (
          <ul>
            {moviesList.map((movie) => (
              <li key={movie.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <h3 className="text-white">{movie.title}</h3>
                <p className="text-white">{movie.overview.substring(0, 150)}...</p>
              </li>
            ))}
          </ul>
         )}
         
       </section>
      </div>
    </main>
  );
}

export default App;
