//useCallback

import React, { useEffect, useReducer, useContext, useRef, useMemo, useCallback } from 'react';
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

  // Create a ref to reference the card DOM element
  const cardRef = useRef(null);

  useEffect(() => {
    console.log(`You ${state.hasLiked ? 'liked' : 'disliked'} the movie ${title}`);
  }, [state.hasLiked, title]);

  // Memoize handleCount function using useCallback
  const handleCount = useCallback(() => {
    dispatch({ type: 'increment' });
  }, []);  // handleCount doesn't depend on any external state

  // Memoize handleLike function using useCallback
  const handleLike = useCallback(() => {
    dispatch({ type: 'toggleLike' });
  }, []);  // handleLike doesn't depend on any external state

  // Handle card click to highlight it
  const handleCardClick = () => {
    // Access the card DOM element via the ref and change its background color
    if (cardRef.current) {
      cardRef.current.style.backgroundColor = cardRef.current.style.backgroundColor === 'lightyellow' ? '' : 'lightyellow';
    }
    handleCount();
  };

  // Use useMemo to memoize the calculation of whether the movie is cool
  const movieStatus = useMemo(() => {
    return ratings >= 4 && isCool ? 'Cool Movie' : 'Not Cool Movie';
  }, [ratings, isCool]);  // Only recalculate when ratings or isCool change

  return (
    <div
      ref={cardRef}  // Attach the ref to the DOM element
      className={`card-cointainer ${theme}`} 
      onClick={handleCardClick}
    >
      <h2>{title} - {state.count}</h2>
      <p>Rating: {ratings}</p>
      <p>{movieStatus}</p> {/* Memoized movie status */}
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



