import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



//Lets pass prop from parent component (App) to Child Component (card), you can pass prop of any data type for instance we pass data type of string, number, boolean and object. prop we pass include title, ratings, isCool and aactors
function Card({title, ratings, isCool, actors }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>Rating: {ratings}</p>
      <p>Is this movie cool: {isCool? 'Yes' : 'No'}</p>
      {/* <p>Actors: {actors.map(actor => actor.name).join(', ')}</p> */}
     
    </div>
  )
}



//Function Component
function App() {
return (
  <div>
  <h2>Functional Component</h2>
  <Card title='Lion king' ratings= {5} isCool= {true} actors={[{name: 'Actors'}]}/>
  <Card title='Ijeoma'/>
  <Card title='Avengers'/>
  <Card title='Paradox'/>
  </div>

)
  
}

export default App
