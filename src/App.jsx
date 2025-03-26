import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'




function Card({title, ratings, isCool, actors }) {
  return (
    //Adding inline styles 
    //Note inline styles has the preference over other styles should incase it clash with other type of styling.
    //it is important to stick with one way of styling in todays world tailwind css is gloally used. we will use it later.
    <div className={isCool ? 'cool-background' : 'normal-background card-cointainer' } style={{
      
    }}>
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
