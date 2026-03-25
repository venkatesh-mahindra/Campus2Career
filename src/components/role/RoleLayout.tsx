import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    GraduationCap, LogOut, ChevronLeft, Menu, Bell,
    UserCircle, ChevronDown, ChevronRight, Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { RoleNavItem } from '../../config/roles/roleNavigation';

interface RoleLayoutProps {
    navItems: RoleNavItem[];
    portalTitle: string;
    accentColor?: string; // tailwind color class e.g. 'bg-purple-600'
    loginPath: string;
}

export const RoleLayout: React.FC<RoleLayoutProps> = ({
    navItems,
    portalTitle,
    accentColor = 'bg-primary',
    loginPath,
}) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate(loginPath, { replace: true });
    };

    const sections = Array.from(new Set(navItems.map(i => i.section)));

    const userName = user?.name || 'User';
    const rawRole = user?.role as string | undefined;
    const userRole = rawRole === 'system_admin' ? 'System Administrator'
        : rawRole ? rawRole.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : 'Admin';

    const currentNav = navItems.find(i => location.pathname === i.path || location.pathname.startsWith(i.path + '/'));

    return (
        <div className="flex h-screen bg-background overflow-hidden text-foreground">

            {/* Mobile backdrop */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 bg-card border-r border-border flex flex-col
                transition-all duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
                lg:translate-x-0 lg:static ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
            `}>
                {/* Brand */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`${accentColor} p-2 rounded-xl flex-shrink-0`}>
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        {!isCollapsed && (
                            <span className="font-bold text-sm whitespace-nowrap text-foreground">{portalTitle}</span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCollapsed(p => !p)}
                        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Role badge */}
                {!isCollapsed && (
                    <div className="mx-3 mt-3 mb-1">
                        <div className={`${accentColor} bg-opacity-10 rounded-lg px-3 py-2`}>
                            <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                            <p className="text-xs text-muted-foreground truncate">{userRole}</p>
                        </div>
                    </div>
                )}

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-4 px-3">
                    {sections.map(section => {
                        const items = navItems.filter(i => i.section === section);
                        return (
                            <div key={section} className="mb-5">
                                {!isCollapsed && (
                                    <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {section}
                                    </h4>
                                )}
                                <ul className="space-y-1">
                                    {items.map(item => {
                                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                                        return (
                                            <li key={item.path}>
                                                <NavLink
                                                    to={item.path}
                                                    onClick={() => setIsMobileOpen(false)}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                                                        ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
                                                        ${isCollapsed ? 'justify-center' : ''}
                                                    `}
                                                    title={isCollapsed ? item.label : undefined}
                                                >
                                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                                    {!isCollapsed && <span className="truncate text-sm">{item.label}</span>}
                                                </NavLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="text-sm">Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 z-20 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl">
                            <Menu className="w-5 h-5" />
                        </button>
                        <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
                            <span className="text-muted-foreground">{portalTitle}</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{currentNav?.label || 'Dashboard'}</span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden md:flex relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input type="text" placeholder="Search..." className="input-nmims py-2 pl-9 pr-4 w-52 bg-secondary/50 h-9 border-transparent rounded-xl text-sm" />
                        </div>

                        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card" />
                        </button>

                        <div className="relative">
                            <div className="flex items-center gap-2 pl-3 border-l border-border cursor-pointer hover:bg-secondary/50 p-1.5 pr-2 rounded-full transition-colors"
                                onClick={() => setShowDropdown(!showDropdown)}>
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <UserCircle className="w-8 h-8 text-primary/80" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-semibold text-foreground leading-none">{userName}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 leading-none">{userRole}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                            </div>
                            {showDropdown && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
                                    <div className="absolute right-0 mt-2 w-52 bg-card rounded-xl shadow-lg border border-border z-40 overflow-hidden">
                                        <div className="p-3 border-b border-border">
                                            <p className="text-sm font-semibold text-foreground">{userName}</p>
                                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                                        </div>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
