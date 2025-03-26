// 


//for useContext

// import React, { useEffect, useState, useContext } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
// import './App.css';

// // Create a ThemeContext with default value 'light'
// const ThemeContext = React.createContext('light');

// function Card({ title, ratings, isCool, actors }) {
//   const [hasLiked, setHasLiked] = useState(false);
//   const [count, setCount] = useState(0);

//   // Get the current theme value from the context
//   const theme = useContext(ThemeContext);

//   useEffect(() => {
//     console.log(`You ${hasLiked ? 'liked' : 'disliked'} the movie ${title}`);
//   }, [hasLiked, title]);

//   // Handle count function
//   const handleCount = () => {
//     setCount((prevState) => prevState + 1);
//   };

//   return (
//     <div className={`card-cointainer ${theme}`} onClick={handleCount}>
//       <h2>{title} - {count}</h2>
//       <p>Rating: {ratings}</p>
//       <p>Is this movie cool: {isCool ? 'Yes' : 'No'}</p>
//       <button onClick={() => setHasLiked(!hasLiked)}>
//         {hasLiked ? 'Liked' : 'Like'}
//       </button>
//       <p>Current Theme: {theme}</p>
//     </div>
//   );
// }

// // Function Component
// function App() {
//   // Set the theme context value to 'dark'
//   return (
//     <ThemeContext.Provider value="dark">
//       <div>
//         <h2>Functional Component</h2>
//         <Card title="Lion king" ratings={5} isCool={true} actors={[{ name: 'Actors' }]} />
//         <Card title="Ijeoma" ratings={4} isCool={false} actors={[{ name: 'Ijeoma' }]} />
//         <Card title="Avengers" ratings={5} isCool={true} actors={[{ name: 'Actors' }]} />
//         <Card title="Paradox" ratings={3} isCool={true} actors={[{ name: 'Actors' }]} />
//       </div>
//     </ThemeContext.Provider>
//   );
// }

// export default App;


// for useReducer

import React, { useEffect, useReducer, useContext } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// Create a ThemeContext with default value 'light'
const ThemeContext = React.createContext('light');

// Reducer function to manage the state of count and hasLiked
function cardReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'toggleLike':
      return { ...state, hasLiked: !state.hasLiked };
    default:
      return state;
  }
}

function Card({ title, ratings, isCool, actors }) {
  // Using useReducer for count and hasLiked state
  const [state, dispatch] = useReducer(cardReducer, { count: 0, hasLiked: false });

  // Get the current theme value from the context
  const theme = useContext(ThemeContext);

  useEffect(() => {
    console.log(`You ${state.hasLiked ? 'liked' : 'disliked'} the movie ${title}`);
  }, [state.hasLiked, title]);

  // Handle count function using dispatch
  const handleCount = () => {
    dispatch({ type: 'increment' });
  };

  // Handle like function using dispatch
  const handleLike = () => {
    dispatch({ type: 'toggleLike' });
  };

  return (
    <div className={`card-cointainer ${theme}`} onClick={handleCount}>
      <h2>{title} - {state.count}</h2>
      <p>Rating: {ratings}</p>
      <p>Is this movie cool: {isCool ? 'Yes' : 'No'}</p>
      <button onClick={handleLike}>
        {state.hasLiked ? 'Liked' : 'Like'}
      </button>
      <p>Current Theme: {theme}</p>
    </div>
  );
}

// Function Component
function App() {
  // Set the theme context value to 'dark'
  return (
    <ThemeContext.Provider value="dark">
      <div>
        <h2>Functional Component</h2>
        <Card title="Lion king" ratings={5} isCool={true} actors={[{ name: 'Actors' }]} />
        <Card title="Ijeoma" ratings={4} isCool={false} actors={[{ name: 'Ijeoma' }]} />
        <Card title="Avengers" ratings={5} isCool={true} actors={[{ name: 'Actors' }]} />
        <Card title="Paradox" ratings={3} isCool={true} actors={[{ name: 'Actors' }]} />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
