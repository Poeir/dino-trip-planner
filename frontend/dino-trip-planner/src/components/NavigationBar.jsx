import { NavLink } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
    return (
        // Bottom Navigation Bar
        <nav className="bottom-navigation">
            <NavLink to="/" className="nav-side nav-left">
                <span className="nav-icon">🦖</span>
            </NavLink>
            <div className="nav-title">
                ไดโน
            </div>
            <button className="nav-side nav-menu">
                ☰
            </button>
        </nav>
    );
}

export default NavigationBar;
