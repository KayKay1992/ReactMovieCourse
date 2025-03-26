import React, { useState } from "react";
import hero from './assets/hero.png'
import Search from "./Components/Search";

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src={hero} alt="Hero Banner"/>
          <h1> Find <span class="text-gradient">Movies </span>You Will Enjoy Without A Hassle</h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>
    </main>
  );
}

export default App;
