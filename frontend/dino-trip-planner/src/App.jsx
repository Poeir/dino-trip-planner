import { Outlet } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/footer";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <NavigationBar />

      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;