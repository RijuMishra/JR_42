import { Link } from "react-router-dom";
import {
  Package,
  CircuitBoard,
  TrendingDown,
  Bell,
  BarChart3,
  FileSpreadsheet,
  ArrowRight,
  ChevronDown,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Component Inventory Management",
    desc: "Add, view, and update electronic components with real-time stock tracking. Monitor current stock, monthly requirements, and part codes.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: CircuitBoard,
    title: "PCB-Component Mapping",
    desc: "Define which components are used in each PCB and specify the exact quantity required per unit produced.",
    color: "from-indigo-500 to-purple-400",
  },
  {
    icon: TrendingDown,
    title: "Automatic Stock Deduction",
    desc: "When a PCB is produced, component stock is automatically deducted. Blocked if insufficient stock exists.",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: Bell,
    title: "Procurement Trigger Logic",
    desc: "Automatically flags components as Low Stock when current stock falls below 20% of monthly requirement.",
    color: "from-orange-500 to-amber-400",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Component-wise consumption summary, top consumed components, shortage analysis with visual indicators.",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel Import / Export",
    desc: "Bulk import component inventory from Excel files and export inventory data and consumption reports.",
    color: "from-rose-500 to-red-400",
  },
];

export default function Landing() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToLogin = () => {
    document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-wide">KAIZEN</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-300 animate-slide-up">
            <Sparkles size={14} />
            <span>Smart PCB & Inventory Management</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">Kaizen</span>
            <br />
            <span className="text-gradient">Intelligence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Smart PCB Component & Stock Management System — track inventory, automate stock deduction, trigger procurement, and analyze consumption in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={scrollToLogin} className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Get Started
              <ArrowRight size={20} />
            </button>
            <button onClick={scrollToFeatures} className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              View Features
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: "Real-time", label: "Stock Tracking" },
              { value: "Auto", label: "Deduction" },
              { value: "Smart", label: "Procurement" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-gradient">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-300">
              <Shield size={14} />
              <span>Core Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to manage
              <span className="text-gradient"> PCB production</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A complete solution for component inventory management, production tracking, and analytics — built for real-world manufacturing workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card-hover p-6 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="relative py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/5" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-slate-400 mb-8">
                Login to access the dashboard or create a new account to start managing your PCB inventory.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/login" className="btn-primary flex items-center gap-2 px-8 py-3.5 w-full sm:w-auto justify-center">
                  Login
                  <ArrowRight size={18} />
                </Link>
                <Link to="/signup" className="btn-secondary flex items-center gap-2 px-8 py-3.5 w-full sm:w-auto justify-center">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-400">Kaizen Intelligence</span>
          </div>
          <p className="text-xs text-slate-600">
            Built by Electrolyte Solutions &middot; 2026
          </p>
        </div>
      </footer>
    </div>
  );
}