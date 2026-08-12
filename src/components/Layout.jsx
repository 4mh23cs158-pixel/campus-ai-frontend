import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
    LayoutDashboard, 
    ClipboardList, 
    PlusCircle, 
    Settings, 
    LogOut,
    Users,
    Building2,
    BarChart3,
    Menu,
    X,
    Moon,
    Sun
} from 'lucide-react';
import { Button } from './ui/Button';

const Layout = () => {
    const { role, currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getNavItems = () => {
        switch (role) {
            case 'student':
                return [
                    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
                    { label: 'My Complaints', path: '/student/complaints', icon: ClipboardList },
                    { label: 'New Complaint', path: '/student/complaints/create', icon: PlusCircle },
                ];
            case 'staff':
                return [
                    { label: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
                    { label: 'Assigned Complaints', path: '/staff/complaints', icon: ClipboardList },
                ];
            case 'admin':
                return [
                    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
                    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
                    { label: 'All Complaints', path: '/admin/complaints', icon: ClipboardList },
                    { label: 'Departments', path: '/admin/departments', icon: Building2 },
                    { label: 'Users', path: '/admin/users', icon: Users },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4">
                <span className="text-xl font-bold text-primary-600">CampusCare</span>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 hidden md:flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600 tracking-tight">CampusCare</span>
                        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                        </Button>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                        ${isActive 
                                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-700/10 dark:text-primary-200' 
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}
                                    `}
                                >
                                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-700 dark:text-primary-200' : 'text-slate-400 dark:text-slate-400'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="mb-4 px-3 flex flex-col">
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{currentUser?.name || 'User'}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</span>
                        </div>
                        <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-200" onClick={handleLogout}>
                            <LogOut className="mr-3 h-5 w-5 text-slate-400" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-6 md:p-8">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;
