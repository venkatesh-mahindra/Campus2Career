import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GraduationCap, AlertCircle, Eye, EyeOff,
    ServerCog, Landmark, Target, BookOpen, UserCheck, Handshake,
    ChevronDown, Copy, Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getDefaultAdminRoute } from '../../config/admin/roleRoutes';

// ── Demo credentials per role ──────────────────────────────────
const ROLE_PROFILES = [
    {
        role: 'system_admin',
        label: 'System Admin',
        icon: ServerCog,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/30',
        activeBg: 'bg-rose-500/20 border-rose-500/60',
        email: 'sysadmin@nmims.edu',
        password: 'SysAdmin@2025',
        description: 'Full platform access — users, settings, audit logs',
    },
    {
        role: 'dean',
        label: 'Dean',
        icon: Landmark,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/30',
        activeBg: 'bg-purple-500/20 border-purple-500/60',
        email: 'dean@nmims.edu',
        password: 'Dean@2025',
        description: 'Strategic oversight — reports, analytics, policy',
    },
    {
        role: 'director',
        label: 'Director',
        icon: Target,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/30',
        activeBg: 'bg-blue-500/20 border-blue-500/60',
        email: 'director@nmims.edu',
        password: 'Director@2025',
        description: 'Operational oversight — drives, companies, reports',
    },
    {
        role: 'program_chair',
        label: 'Program Chair',
        icon: BookOpen,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        activeBg: 'bg-amber-500/20 border-amber-500/60',
        email: 'programchair@nmims.edu',
        password: 'ProgramChair@2025',
        description: 'Department management — eligibility, students, analytics',
    },
    {
        role: 'faculty',
        label: 'Faculty',
        icon: UserCheck,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        activeBg: 'bg-emerald-500/20 border-emerald-500/60',
        email: 'faculty@nmims.edu',
        password: 'Faculty@2025',
        description: 'Student mentorship — profiles, interviews, batch data',
    },
    {
        role: 'placement_officer',
        label: 'Placement Officer',
        icon: Handshake,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10 border-cyan-500/30',
        activeBg: 'bg-cyan-500/20 border-cyan-500/60',
        email: 'placement@nmims.edu',
        password: 'Placement@2025',
        description: 'Placement operations — companies, drives, offers',
    },
];

export const AdminLogin: React.FC = () => {
    const { adminLogin, user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [showCredentials, setShowCredentials] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    // Once user is set in context (by adminLogin or onAuthStateChanged), navigate to their dashboard
    useEffect(() => {
        if (user && user.role && user.role !== 'student') {
            const route = getDefaultAdminRoute(user.role);
            navigate(route, { replace: true });
        }
    }, [user, navigate]);

    const handleRoleSelect = (profile: typeof ROLE_PROFILES[0]) => {
        setSelectedRole(profile.role);
        setEmail(profile.email);
        setPassword(profile.password);
        setError(null);
    };

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(key);
        setTimeout(() => setCopiedField(null), 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }
        setIsLoading(true);
        try {
            await adminLogin(email, password);
            // Navigation is handled by the useEffect watching user state
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const selectedProfile = ROLE_PROFILES.find(p => p.role === selectedRole);

    return (
        <div className="min-h-screen flex text-foreground bg-background relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-multiply opacity-50 animate-float pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply opacity-50 pointer-events-none" />

            <div className="relative z-10 m-auto w-full max-w-lg p-4 sm:p-6 animate-fade-in-up">
                <div className="glass-nmims p-6 sm:p-8 shadow-2xl">

                    {/* Header */}
                    <div className="mb-6 text-center">
                        <div className="w-14 h-14 bg-gradient-nmims rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
                            <GraduationCap className="h-7 w-7 text-white -rotate-3" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Admin Portal</h1>
                        <p className="text-muted-foreground text-sm">Campus2Career — NMIMS Placement System</p>
                    </div>

                    {/* Role Selector */}
                    <div className="mb-5">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Select Your Role</p>
                        <div className="grid grid-cols-3 gap-2">
                            {ROLE_PROFILES.map((profile) => {
                                const Icon = profile.icon;
                                const isActive = selectedRole === profile.role;
                                return (
                                    <button
                                        key={profile.role}
                                        type="button"
                                        onClick={() => handleRoleSelect(profile)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${isActive ? profile.activeBg : profile.bg} hover:opacity-90`}
                                    >
                                        <Icon className={`w-5 h-5 ${profile.color}`} />
                                        <span className={`text-xs font-semibold leading-tight text-center ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {profile.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {selectedProfile && (
                            <p className="text-xs text-muted-foreground mt-2 text-center animate-fade-in-up">
                                {selectedProfile.description}
                            </p>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-fade-in-up">
                            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive leading-tight">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Staff Email</label>
                            <input
                                type="email"
                                className="input-nmims"
                                placeholder="admin@nmims.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-nmims pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn-nmims-primary w-full py-3 flex items-center justify-center gap-2 ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {selectedProfile && <selectedProfile.icon className="w-4 h-4" />}
                                    Authenticate{selectedProfile ? ` as ${selectedProfile.label}` : ''}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials Accordion */}
                    <div className="mt-5 border border-border/50 rounded-xl overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowCredentials(!showCredentials)}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        >
                            <span>Demo Credentials</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCredentials ? 'rotate-180' : ''}`} />
                        </button>

                        {showCredentials && (
                            <div className="border-t border-border/50 divide-y divide-border/30">
                                {ROLE_PROFILES.map((profile) => {
                                    const Icon = profile.icon;
                                    return (
                                        <div key={profile.role} className="px-4 py-3 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${profile.bg}`}>
                                                <Icon className={`w-4 h-4 ${profile.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-foreground">{profile.label}</p>
                                                <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{profile.password}</p>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(profile.email, `${profile.role}-email`)}
                                                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                                    title="Copy email"
                                                >
                                                    {copiedField === `${profile.role}-email` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRoleSelect(profile)}
                                                    className={`text-xs px-2 py-0.5 rounded-lg font-medium transition-colors ${profile.bg} ${profile.color}`}
                                                >
                                                    Use
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
