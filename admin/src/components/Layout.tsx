import {
    BarChart3,
    Bell,
    Globe,
    LayoutDashboard,
    LogOut,
    Map as MapIcon,
    Settings
} from 'lucide-react';
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Globe size={28} />
                    <span>GeoAdTech Admin</span>
                </div>

                <nav className="nav-links">
                    <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <MapIcon size={20} />
                        <span>Projects</span>
                    </NavLink>
                    <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Bell size={20} />
                        <span>Notifications</span>
                    </NavLink>
                    <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </NavLink>
                </nav>

                <div className="mt-auto" style={{ marginTop: 'auto' }}>
                    <NavLink to="/settings" className="nav-item">
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                    <button className="nav-item" style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
