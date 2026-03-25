import { Outlet } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/footer";
import ChatWidget from "./components/ChatWidget";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <NavigationBar />

      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;