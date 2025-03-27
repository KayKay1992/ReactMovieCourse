import React, { useState, useEffect } from "react";
import hero from './assets/hero.png'
import Search from "./Components/Search";

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

  //Declare a function that will allow you to fetch those movies.

  const fetchMovies = async () => {
    try {
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
      console.log(data)
      //Set the movies state with the received data
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(`Error fetching movies: ${error.message}`);
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
           {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <h2>Search Results:</h2>
       </section>
      </div>
    </main>
  );
}

export default App;
