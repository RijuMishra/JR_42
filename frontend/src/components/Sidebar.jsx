import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  CircuitBoard,
  Factory,
  BarChart3,
  FileSpreadsheet,
  X,
  Zap,
  Settings as SettingsIcon,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/components", label: "Components", icon: Package },
  { path: "/pcb-mapping", label: "PCB Mapping", icon: CircuitBoard },
  { path: "/production", label: "Production Entry", icon: Factory },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/import-export", label: "Import / Export", icon: FileSpreadsheet },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-50
          flex flex-col transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">KAIZEN</h2>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider">INTELLIGENCE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-700/50">
          <div className="px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-700/30">
            <p className="text-[11px] text-slate-500 font-medium">Kaizen Intelligence v1.0</p>
            <p className="text-[10px] text-slate-600">Enterprise Edition</p>
          </div>
        </div>
      </aside>
    </>
  );
}