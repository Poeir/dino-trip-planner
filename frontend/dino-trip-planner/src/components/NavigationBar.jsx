import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './NavigationBar.css';
function NavigationBar() {
    const [open, setOpen] = useState(false);

    return (
        <>

            <nav className="bottom-navigation">
                {/* Logo */}
                <NavLink to="/" className="nav-side">
                    <span className="nav-icon">🦖</span>
                </NavLink>

                {/* Desktop Menu */}
                <div className="nav-links">
                    <NavLink to="/" className="nav-link">หน้าแรก</NavLink>
                    <NavLink to="/ai-trip" className="nav-link nav-link-primary">
                        🤖 AI วางแผนทริป
                    </NavLink>
                    <NavLink to="/about-khonkaen" className="nav-link">
                        เกี่ยวกับขอนแก่น
                    </NavLink>
                    <NavLink to="/contact" className="nav-link">
                        ติดต่อ-สอบถาม
                    </NavLink>
                </div>

                {/* Mobile AI */}
                <NavLink to="/ai-trip" className="nav-mobile-ai">
                    🤖 AI วางแผนทริป
                </NavLink>

                {/* Hamburger */}
                <button
                    className="nav-side nav-menu"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
            </nav>

            {/* Mobile Menu */}
            {open && (
                <div className="nav-dropdown">
                    <NavLink to="/" className="nav-item" onClick={() => setOpen(false)}>
                        หน้าแรก
                    </NavLink>
                    <NavLink to="/about-khonkaen" className="nav-item" onClick={() => setOpen(false)}>
                        เกี่ยวกับขอนแก่น
                    </NavLink>
                    <NavLink to="/contact" className="nav-item" onClick={() => setOpen(false)}>
                        ติดต่อ-สอบถาม
                    </NavLink>
                </div>
            )}
        </>
    );
}

export default NavigationBar;
