import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";


// Render the application
//strictmode is removed so that the useEffect wont render twice or mount twice in ptoduction.
createRoot(document.getElementById("root")).render(
<App />
);
