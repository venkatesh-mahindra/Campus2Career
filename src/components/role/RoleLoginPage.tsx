import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RoleLoginPageProps {
    role: string;
    roleLabel: string;
    dashboardPath: string;
    accentColor: string;        // e.g. 'from-rose-600 to-rose-800'
    accentBg: string;           // e.g. 'bg-rose-500/10'
    accentBorder: string;       // e.g. 'border-rose-500/30'
    accentText: string;         // e.g. 'text-rose-400'
    icon: React.ElementType;
    demoEmail: string;
    demoPassword: string;
    description: string;
}

export const RoleLoginPage: React.FC<RoleLoginPageProps> = ({
    roleLabel,
    dashboardPath,
    accentColor,
    accentBg,
    accentBorder,
    accentText,
    icon: Icon,
    demoEmail,
    demoPassword,
    description,
}) => {
    const { adminLogin, user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // If already logged in as this role, redirect
    useEffect(() => {
        if (!authLoading && user && user.role !== 'student') {
            navigate(dashboardPath, { replace: true });
        }
    }, [user, authLoading, navigate, dashboardPath]);

    const fillDemo = () => {
        setEmail(demoEmail);
        setPassword(demoPassword);
        setError(null);
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
            // useEffect above handles navigation once user state updates
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
            {/* Background glows */}
            <div className={`absolute top-[-15%] left-[-10%] w-[45%] h-[45%] blur-[140px] rounded-full opacity-30 pointer-events-none bg-gradient-to-br ${accentColor}`} />
            <div className={`absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full opacity-20 pointer-events-none bg-gradient-to-br ${accentColor}`} />

            <div className="relative z-10 m-auto w-full max-w-md px-4 py-8 animate-fade-in-up">

                {/* Back link */}
                <button onClick={() => navigate('/login/admin')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    All portals
                </button>

                <div className="glass-nmims p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-7">
                        <div className={`w-16 h-16 bg-gradient-to-br ${accentColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                            <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{roleLabel} Portal</h1>
                        <p className="text-muted-foreground text-sm mt-1">{description}</p>
                    </div>

                    {/* Demo credentials hint */}
                    <div className={`mb-5 p-3 rounded-xl ${accentBg} border ${accentBorder} flex items-center justify-between`}>
                        <div>
                            <p className="text-xs font-semibold text-foreground">Demo Account</p>
                            <p className="text-xs text-muted-foreground font-mono">{demoEmail}</p>
                        </div>
                        <button type="button" onClick={fillDemo}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${accentBg} ${accentText} border ${accentBorder} hover:opacity-80 transition-opacity`}>
                            Use Demo
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Email</label>
                            <input type="email" className="input-nmims" placeholder={demoEmail}
                                value={email} onChange={e => setEmail(e.target.value)}
                                disabled={isLoading} required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} className="input-nmims pr-10"
                                    placeholder="••••••••" value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={isLoading} required />
                                <button type="button" tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowPassword(p => !p)}>
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading}
                            className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${accentColor} hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 disabled:opacity-60`}>
                            {isLoading
                                ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <><Icon className="w-4 h-4" /> Sign in as {roleLabel}</>
                            }
                        </button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground mt-5">
                        Campus2Career · NMIMS Placement System
                    </p>
                </div>
            </div>
        </div>
    );
};
