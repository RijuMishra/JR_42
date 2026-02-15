import { useEffect, useState } from "react";
import {
    User,
    Bell,
    Shield,
    Database,
    Save,
    CheckCircle2,
    Moon,
    Monitor,
    Globe,
    Users,
    Trash2,
    ShieldCheck,
    Loader2
} from "lucide-react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile"); // profile, team, safety
    const [saved, setSaved] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // In a real app, this should come from a decoded JWT or a dedicated /me endpoint
    // For now, we use the role stored in localStorage during login
    const userRole = localStorage.getItem("userRole") || "viewer";
    const isAdmin = userRole === "admin" || userRole === "owner";

    const [profile, setProfile] = useState({
        name: localStorage.getItem("userName") || "Admin User",
        email: localStorage.getItem("userEmail") || "admin@kaizen.com",
        role: userRole.charAt(0).toUpperCase() + userRole.slice(1)
    });

    const fetchUsers = async () => {
        if (!isAdmin) return;
        try {
            setLoadingUsers(true);
            const res = await API.get("/auth/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;
        try {
            await API.delete(`/auth/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("Delete failed: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    useEffect(() => {
        if (activeTab === "team") {
            fetchUsers();
        }
    }, [activeTab]);

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-5xl space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Command Settings</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage your identity and team permissions.</p>
                </div>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20"
                    >
                        <CheckCircle2 size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">System Updated</span>
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-1.5">
                    {[
                        { id: "profile", icon: User, label: "Profile" },
                        { id: "team", icon: Users, label: "Team Management", hidden: !isAdmin },
                        { id: "safety", icon: Shield, label: "Safety & Privacy" },
                    ].map((item) => (
                        !item.hidden && (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${activeTab === item.id
                                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                    }`}
                            >
                                <item.icon size={18} />
                                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                            </button>
                        )
                    ))}
                    <div className="pt-4 border-t border-slate-800 mt-4 opacity-30">
                        <div className="px-4 py-2">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-1">Kaizen v2.4.0-build</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="glass-card"
                            >
                                <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                                            <User size={20} />
                                        </div>
                                        <h3 className="font-bold text-white tracking-tight">Personal Identity</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{profile.role}</span>
                                </div>
                                <form onSubmit={handleSave} className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Display Name</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Email</label>
                                            <input
                                                type="email"
                                                className="input-field"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary py-4 px-8 flex items-center justify-center gap-2 font-bold tracking-widest text-xs uppercase">
                                        <Save size={16} />
                                        Synchronize Changes
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === "team" && isAdmin && (
                            <motion.div
                                key="team"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="glass-card overflow-hidden"
                            >
                                <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                                            <Users size={20} />
                                        </div>
                                        <h3 className="font-bold text-white tracking-tight">Access Control (Admin)</h3>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total: {users.length}</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User Profile</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Permission Level</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {loadingUsers ? (
                                                <tr>
                                                    <td colSpan="3" className="py-20 text-center">
                                                        <Loader2 className="animate-spin text-indigo-500 mx-auto" />
                                                    </td>
                                                </tr>
                                            ) : users.map((u) => (
                                                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 border border-slate-700">
                                                                {u.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white">{u.name}</p>
                                                                <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <ShieldCheck size={14} className={u.role === 'admin' ? 'text-indigo-400' : 'text-slate-500'} />
                                                            <span className={`text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'text-indigo-400' : 'text-slate-400'}`}>
                                                                {u.role}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => deleteUser(u.id)}
                                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "safety" && (
                            <motion.div
                                key="safety"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="glass-card p-8 text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-500">
                                    <Shield size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Trust & Security</h3>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                    Your data is encrypted by default. Multi-factor authentication is currently managed via organization policy.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
