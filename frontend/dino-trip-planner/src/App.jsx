import { Outlet } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <NavigationBar />
      <main className="main-content">
        <Outlet />
      </main>
      
    </div>
  )
}

export default App
