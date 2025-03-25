import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//Class Components
//Not widely used now. 
// class ClassComponent extends React.Component {
//   render(){
//     return (
//       <div className="card">
//         <h2>Class Component</h2>
//         <p>Hello, I am a class component.</p>
//       </div>
//     )
//   }
// }

//Components are reuseable. lets create a new Component card component and reused it in the app compoenent which is the master component
function Card() {
  return (
    <div className="card">
      <h2>My Card component</h2>
     
    </div>
  )
}



//Function Component
function App() {
return (
  <div>
  <h2>Functional Component</h2>
  <Card/>
  <Card/>
  <Card/>
  <Card/>
  </div>

)
  
}

export default App
