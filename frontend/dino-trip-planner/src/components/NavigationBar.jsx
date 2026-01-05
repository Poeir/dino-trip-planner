import { NavLink } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
    return (
        <nav className="bottom-navigation">
            {/* Left */}
            <NavLink to="/" className="nav-side nav-left">
                <span className="nav-icon">🦖</span>
            </NavLink>

            {/* Center */}
            <div className="nav-title">
                ไดโน
            </div>

            {/* Right */}
            <button className="nav-side nav-menu">
                ☰
            </button>
        </nav>
    );
}

export default NavigationBar;
