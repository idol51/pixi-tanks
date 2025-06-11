import { createRoot } from "react-dom/client";
import "./style.css";

const App = () => <div>Pixi Tanks</div>;

createRoot(document.getElementById("app")!).render(<App />);
