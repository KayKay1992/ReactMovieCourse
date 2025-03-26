import React from "react";
import hero from './assets/hero.png'

function App() {
  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src={hero} alt="Hero Banner"/>
          <h1> Find <span class="text-gradient">Movies </span>You Will Enjoy Without A Hassle</h1>
        </header>
        <p>Search</p>
      </div>
    </main>
  );
}

export default App;
