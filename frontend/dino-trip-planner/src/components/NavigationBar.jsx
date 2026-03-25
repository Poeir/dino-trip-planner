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
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        หน้าแรก
                    </NavLink>

                    <NavLink
                        to="/events"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        อีเวนต์
                    </NavLink>

                    <NavLink
                        to="/ai-trip"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link nav-link-ai active-ai"
                                : "nav-link nav-link-ai"
                        }
                    >
                        🤖 AI วางแผนทริป
                    </NavLink>

                    <NavLink
                        to="/about-khonkaen"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        เกี่ยวกับขอนแก่น
                    </NavLink>

                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        ติดต่อ-สอบถาม
                    </NavLink>
                </div>

                {/* Mobile AI */}
                <NavLink
                    to="/ai-trip"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-mobile-ai active-ai"
                            : "nav-mobile-ai"
                    }
                >
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

            {/* Mobile Dropdown */}
            {open && (
                <div className="nav-dropdown">
                    {[
                        { to: "/", label: "หน้าแรก" },
                        { to: "/events", label: "📅 กิจกรรม" },
                        { to: "/about-khonkaen", label: "เกี่ยวกับขอนแก่น" },
                        { to: "/contact", label: "ติดต่อ-สอบถาม" }
                    ].map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-item active"
                                    : "nav-item"
                            }
                            onClick={() => setOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </>
    );
}

export default NavigationBar;
