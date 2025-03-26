import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


//To explain the useEFFECT lets say you want to log a message each time the user likes a movie for this we use a useEffect.

function Card({title, ratings, isCool, actors }) {

  const [hasLiked, setHasLiked] = useState(false)
  //To check the number of count we need to use useState.
  const [count, setCount] = useState(0)
  
  //useEffect is a hook that lets you perform side effects in function components
  useEffect(() => {
    console.log(`You ${hasLiked? 'liked' : 'disliked'} the movie ${title}`)
  }, [hasLiked, title])

  //handle count function
  const handleCount = () => {
    setCount((prevState) => prevState+ 1)
  }

  return (
    <div className="card-cointainer" onClick={handleCount}>
      <h2>{title} - {count}</h2>
      <p>Rating: {ratings}</p>
      <p>Is this movie cool: {isCool? 'Yes' : 'No'}</p>
      <button onClick={() => setHasLiked(!hasLiked)}>{hasLiked? 'Liked' : 'Like'}</button>
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
