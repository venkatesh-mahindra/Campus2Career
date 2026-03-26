import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: 'admin' | 'student';
    requireCareerDiscovery?: boolean;
    requireProfileSetup?: boolean;
    requireAssessment?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRole,
    requireCareerDiscovery,
    requireProfileSetup,
    requireAssessment,
}) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-bold text-primary animate-pulse tracking-widest uppercase">Checking Authorization</p>
                </div>
            </div>
        );
    }

    if (!user) {
        const path = location.pathname;
        if (path.startsWith('/dean')) return <Navigate to="/login/dean" replace />;
        if (path.startsWith('/director')) return <Navigate to="/login/director" replace />;
        if (path.startsWith('/program-chair')) return <Navigate to="/login/program-chair" replace />;
        if (path.startsWith('/faculty')) return <Navigate to="/login/faculty" replace />;
        if (path.startsWith('/placement')) return <Navigate to="/login/placement-officer" replace />;
        if (path.startsWith('/admin')) return <Navigate to="/login/admin" replace />;
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Mock users (preview mode) bypass all role/onboarding checks
    const isMockUser = user.uid?.startsWith('mock-');
    if (isMockUser) return <>{children}</>;

    const isUserAdmin = user.role && user.role !== 'student';

    if (allowedRole === 'admin' && !isUserAdmin) {
        return <Navigate to="/student/dashboard" replace />;
    }

    if (allowedRole === 'student' && isUserAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const isCareerDiscoveryDone = user.careerDiscoveryCompleted === true;
    const isProfileSetupDone = user.profileCompleted === true;
    const isAssessmentDone = user.assessmentCompleted === true;

    if (!isUserAdmin) {
        if (location.pathname === '/career-discovery' && isCareerDiscoveryDone) {
            if (!isProfileSetupDone) return <Navigate to="/student/profile-setup" replace />;
            if (!isAssessmentDone) return <Navigate to="/student/assessment" replace />;
            return <Navigate to="/student/dashboard" replace />;
        }
        if (location.pathname === '/student/profile-setup' && isProfileSetupDone) {
            if (!isAssessmentDone) return <Navigate to="/student/assessment" replace />;
            return <Navigate to="/student/dashboard" replace />;
        }
        if (location.pathname === '/student/assessment' && isAssessmentDone) {
            return <Navigate to="/student/dashboard" replace />;
        }
        if (requireAssessment && !isAssessmentDone) {
            if (!isCareerDiscoveryDone) return <Navigate to="/career-discovery" replace />;
            if (!isProfileSetupDone) return <Navigate to="/student/profile-setup" replace />;
            return <Navigate to="/student/assessment" replace />;
        }
        if (requireProfileSetup && !isProfileSetupDone) {
            if (!isCareerDiscoveryDone) return <Navigate to="/career-discovery" replace />;
            return <Navigate to="/student/profile-setup" replace />;
        }
        if (requireCareerDiscovery && !isCareerDiscoveryDone) {
            return <Navigate to="/career-discovery" replace />;
        }
    }

    return <>{children}</>;
};

export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (user) return <Navigate to="/switch-account" replace />;

    return <>{children}</>;
};
