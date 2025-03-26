import React from 'react'
import searchIcon from '../assets/search.svg'

function Search({searchTerm, setSearchTerm}) {
  return (
    <div className='search'>
       <img src={searchIcon} alt='Search' />
       <input 
         type='text' 
         placeholder='Search through thousands of movies'  
         value={searchTerm} 
         onChange={(e) => setSearchTerm(e.target.value)} />
         <h3 className='text-2xl text-white'>{searchTerm}</h3>

    </div>
  )
}

export default Search