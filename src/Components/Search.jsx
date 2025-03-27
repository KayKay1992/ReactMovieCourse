import React from 'react'
import searchIcon from '../assets/search.svg'

function Search({searchTerm, setSearchTerm}) {
  return (
    <div className='search'>
       <img src={searchIcon} alt='Search' className='' />
       <input 
         type='text' 
         placeholder='Search through thousands of movies'  
         value={searchTerm} 
         onChange={(e) => setSearchTerm(e.target.value)} />
         
    </div>
  )
}

export default Search