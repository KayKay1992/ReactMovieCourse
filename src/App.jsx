import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


//like here if you want to track if someone has like the movie or not you have to use state

function Card({title, ratings, isCool, actors }) {
  const [hasLiked, setHasLiked] = useState(false) 
  return (
   
    <div className={isCool ? 'cool-background' : 'normal-background card-cointainer' } >
      <h2>{title}</h2>
      <p>Rating: {ratings}</p>
      <p>Is this movie cool: {isCool? 'Yes' : 'No'}</p>
      <button onClick={() => setHasLiked(!hasLiked)}>{
        hasLiked? 'Liked' : 'Like'
        }</button>
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
