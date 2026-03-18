import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import {
    Shield, CheckCircle2, XCircle, Loader2,
    ServerCog, Landmark, Target, BookOpen, UserCheck, Handshake, Zap
} from 'lucide-react';

const DEMO_ACCOUNTS = [
    { role: 'system_admin', label: 'System Admin', email: 'sysadmin@nmims.edu', password: 'SysAdmin@2025', name: 'System Administrator', icon: ServerCog, color: 'text-rose-500' },
    { role: 'dean', label: 'Dean', email: 'dean@nmims.edu', password: 'Dean@2025', name: 'Dr. Dean NMIMS', icon: Landmark, color: 'text-purple-500' },
    { role: 'director', label: 'Director', email: 'director@nmims.edu', password: 'Director@2025', name: 'Dr. Director NMIMS', icon: Target, color: 'text-blue-500' },
    { role: 'program_chair', label: 'Program Chair', email: 'programchair@nmims.edu', password: 'ProgramChair@2025', name: 'Prof. Program Chair', icon: BookOpen, color: 'text-amber-500' },
    { role: 'faculty', label: 'Faculty', email: 'faculty@nmims.edu', password: 'Faculty@2025', name: 'Prof. Faculty Member', icon: UserCheck, color: 'text-emerald-500' },
    { role: 'placement_officer', label: 'Placement Officer', email: 'placement@nmims.edu', password: 'Placement@2025', name: 'Placement Officer', icon: Handshake, color: 'text-cyan-500' },
];

type AccountStatus = 'idle' | 'creating' | 'success' | 'error' | 'exists';

export default function CreateAdminAccount() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<string>('system_admin');
    const [isCreating, setIsCreating] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const [seedStatus, setSeedStatus] = useState<Record<string, AccountStatus>>({});
    const [isSeedingAll, setIsSeedingAll] = useState(false);

    const createAccount = async (accEmail: string, accPassword: string, accName: string, accRole: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, accEmail, accPassword);
        const uid = userCredential.user.uid;
        await setDoc(doc(db, 'users', uid), {
            uid,
            email: accEmail,
            name: accName,
            role: accRole,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    };

    const handleCreateSingle = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setResult(null);
        try {
            await createAccount(email, password, name, role);
            setResult({ success: true, message: `Account created! Login at /admin/login with ${email}` });
            setEmail(''); setPassword(''); setName('');
        } catch (error: any) {
            const msg = error.code === 'auth/email-already-in-use'
                ? 'This email is already registered.'
                : error.code === 'auth/weak-password'
                    ? 'Password must be at least 6 characters.'
                    : error.message || 'Failed to create account.';
            setResult({ success: false, message: msg });
        } finally {
            setIsCreating(false);
        }
    };

    const handleSeedAll = async () => {
        setIsSeedingAll(true);
        const statuses: Record<string, AccountStatus> = {};
        DEMO_ACCOUNTS.forEach(a => { statuses[a.role] = 'creating'; });
        setSeedStatus({ ...statuses });

        for (const acc of DEMO_ACCOUNTS) {
            try {
                await createAccount(acc.email, acc.password, acc.name, acc.role);
                statuses[acc.role] = 'success';
            } catch (err: any) {
                statuses[acc.role] = err.code === 'auth/email-already-in-use' ? 'exists' : 'error';
            }
            setSeedStatus({ ...statuses });
        }
        setIsSeedingAll(false);
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-6">

                {/* Seed All Demo Accounts */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Seed All Demo Accounts</h2>
                            <p className="text-xs text-muted-foreground">Creates all 6 role accounts in one click</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {DEMO_ACCOUNTS.map((acc) => {
                            const Icon = acc.icon;
                            const status = seedStatus[acc.role];
                            return (
                                <div key={acc.role} className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50">
                                    <Icon className={`w-4 h-4 flex-shrink-0 ${acc.color}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-700 truncate">{acc.label}</p>
                                        <p className="text-xs text-slate-400 truncate">{acc.email}</p>
                                    </div>
                                    {status === 'creating' && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 flex-shrink-0" />}
                                    {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                                    {status === 'exists' && <span className="text-xs text-amber-500 flex-shrink-0">exists</span>}
                                    {status === 'error' && <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleSeedAll}
                        disabled={isSeedingAll}
                        className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSeedingAll ? <><Loader2 className="h-4 w-4 animate-spin" /> Seeding...</> : <><Zap className="h-4 w-4" /> Seed All Demo Accounts</>}
                    </button>
                </div>

                {/* Create Single Account */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Create Single Account</h2>
                            <p className="text-xs text-muted-foreground">Manually create an account for any role</p>
                        </div>
                    </div>

                    {result && (
                        <div className={`mb-4 p-3 rounded-xl border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-start gap-2">
                                {result.success
                                    ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                    : <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />}
                                <p className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>{result.message}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleCreateSingle} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                    placeholder="Full Name" required disabled={isCreating} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                                <select value={role} onChange={e => setRole(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
                                    disabled={isCreating}>
                                    {DEMO_ACCOUNTS.map(a => <option key={a.role} value={a.role}>{a.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                placeholder="user@nmims.edu" required disabled={isCreating} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                placeholder="Min 6 characters" required disabled={isCreating} minLength={6} />
                        </div>
                        <button type="submit" disabled={isCreating}
                            className="w-full bg-slate-800 text-white font-semibold py-2.5 rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {isCreating ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : <><Shield className="h-4 w-4" /> Create Account</>}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <a href="/admin/login" className="text-sm text-primary hover:underline">Go to Admin Login →</a>
                </div>
            </div>
        </div>
    );
}
